import validator from 'validator';
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student/student.interface';
import config from '../config';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    maxlength: [10, 'First Name can not be more than 10 characters '],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: 'First Name must start with a capital letter',
    },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is required'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: 'Last Name is not valid',
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    trim: true,
    required: [true, "Father's Name is required"],
  },
  fatherOccupation: {
    type: String,
    trim: true,
    required: [true, "Father's Occupation is required"],
  },
  fatherContactNo: {
    type: String,
    trim: true,
    required: [true, "Father's Contact Number is required"],
  },
  motherName: {
    type: String,
    trim: true,
    required: [true, "Mother's Name is required"],
  },
  motherOccupation: {
    type: String,
    trim: true,
    required: [true, "Mother's Occupation is required"],
  },
  motherContactNo: {
    type: String,
    trim: true,
    required: [true, "Mother's Contact Number is required"],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    trim: true,
    required: [true, "Local Guardian's Name is required"],
  },
  occupation: {
    type: String,
    trim: true,
    required: [true, "Local Guardian's Occupation is required"],
  },
  contactNo: {
    type: String,
    trim: true,
    required: [true, "Local Guardian's Contact Number is required"],
  },
  address: {
    type: String,
    trim: true,
    required: [true, "Local Guardian's Address is required"],
  },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      trim: true,
      required: [true, 'Student ID is required'],
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Student Password is required'],
    },
    name: userNameSchema,
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not valid. Gender must be male, female, or other',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      validate: {
        validator: function (email: string) {
          return validator.isEmail(email);
        },
        message: '{VALUE} is not a valid email',
      },
    },
    contactNo: {
      type: String,
      trim: true,
      required: [true, 'Contact Number is required'],
    },
    emergencyContactNo: {
      type: String,
      trim: true,
      required: [true, 'Emergency Contact Number is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message:
          '{VALUE} is not valid. Blood group must be one of A+, A-, B+, B-, AB+, AB-, O+, O-',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local Guardian information is required'],
    },
    profileImg: { type: String },
    isActive: {
      type: String,
      enum: {
        values: ['active', 'blocked'],
        message:
          '{VALUE} is not valid. Status must be either active or blocked',
      },
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

//virtual

studentSchema.virtual('fullName').get(function () {
  return (
    this.name.firstName + ' ' + this.name.middleName + ' ' + this.name.lastName
  );
});

//pre save middleware/ hook : will work on create() and save()
studentSchema.pre('save', async function (next) {
  //console.log(this, 'pre hook: we will save the data');

  // hasing  password and save into DB
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

//post save middleware / hook
studentSchema.post('save', async function (doc, next) {
  //console.log(this, 'post hook: we have saved the data');

  doc.password = '';

  next();
});

// Query Middleware
studentSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// creating a custom static methods
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};
// creating a custom instance methods
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
