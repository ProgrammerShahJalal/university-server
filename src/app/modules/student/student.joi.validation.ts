import Joi from 'joi';

// UserName schema
const userNameSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(10)
    .pattern(/^[A-Z][a-zA-Z]*$/, 'First Name must start with a capital letter')
    .required()
    .messages({
      'string.empty': 'First Name is required',
      'string.max': 'First Name cannot be more than 10 characters',
      'string.pattern.name': 'First Name must start with a capital letter',
    }),
  middleName: Joi.string().trim().optional(),
  lastName: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z]+$/, 'Last Name is not valid')
    .required()
    .messages({
      'string.empty': 'Last Name is required',
      'string.pattern.name': 'Last Name is not valid',
    }),
});

// Guardian schema
const guardianSchema = Joi.object({
  fatherName: Joi.string().trim().required().messages({
    'string.empty': "Father's Name is required",
  }),
  fatherOccupation: Joi.string().trim().required().messages({
    'string.empty': "Father's Occupation is required",
  }),
  fatherContactNo: Joi.string().trim().required().messages({
    'string.empty': "Father's Contact Number is required",
  }),
  motherName: Joi.string().trim().required().messages({
    'string.empty': "Mother's Name is required",
  }),
  motherOccupation: Joi.string().trim().required().messages({
    'string.empty': "Mother's Occupation is required",
  }),
  motherContactNo: Joi.string().trim().required().messages({
    'string.empty': "Mother's Contact Number is required",
  }),
});

// LocalGuardian schema
const localGuardianSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': "Local Guardian's Name is required",
  }),
  occupation: Joi.string().trim().required().messages({
    'string.empty': "Local Guardian's Occupation is required",
  }),
  contactNo: Joi.string().trim().required().messages({
    'string.empty': "Local Guardian's Contact Number is required",
  }),
  address: Joi.string().trim().required().messages({
    'string.empty': "Local Guardian's Address is required",
  }),
});

// Student schema
const studentSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    'string.empty': 'Student ID is required',
  }),
  name: userNameSchema.required().messages({
    'any.required': 'Name is required',
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only': '{#value} is not valid. Gender must be male, female, or other',
    'any.required': 'Gender is required',
  }),
  dateOfBirth: Joi.string().optional(),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': '{#value} is not a valid email',
  }),
  contactNo: Joi.string().trim().required().messages({
    'string.empty': 'Contact Number is required',
  }),
  emergencyContactNo: Joi.string().trim().required().messages({
    'string.empty': 'Emergency Contact Number is required',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .messages({
      'any.only':
        '{#value} is not valid. Blood group must be one of A+, A-, B+, B-, AB+, AB-, O+, O-',
    }),
  presentAddress: Joi.string().required().messages({
    'string.empty': 'Present Address is required',
  }),
  permanentAddress: Joi.string().required().messages({
    'string.empty': 'Permanent Address is required',
  }),
  guardian: guardianSchema.required().messages({
    'any.required': 'Guardian information is required',
  }),
  localGuardian: localGuardianSchema.required().messages({
    'any.required': 'Local Guardian information is required',
  }),
  profileImg: Joi.string().optional(),
  isActive: Joi.string().valid('active', 'blocked').default('active').messages({
    'any.only':
      '{#value} is not valid. Status must be either active or blocked',
  }),
});

export default studentSchema;
