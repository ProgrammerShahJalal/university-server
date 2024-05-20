import { z } from 'zod';

// UserName schema
const userNameSchema = z.object({
  firstName: z
    .string()
    .max(10, 'First Name can not be more than 10 characters')
    .refine((value) => value.charAt(0) === value.charAt(0).toUpperCase(), {
      message: 'First Name must start with a capital letter',
    }),
  middleName: z.string().optional(),
  lastName: z.string().refine((value) => /^[A-Za-z]+$/.test(value), {
    message: 'Last Name is not valid',
  }),
});

// Guardian schema
const guardianSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

// LocalGuardian schema
const localGuardianSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

// Student schema
const studentSchema = z.object({
  id: z.string(),
  password: z.string().max(20),
  name: userNameSchema,
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Gender must be male, female, or other' }),
  }),
  dateOfBirth: z.string().optional(),
  email: z.string().email('Email is not a valid email'),
  contactNo: z.string(),
  emergencyContactNo: z.string(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    errorMap: () => ({
      message: 'Blood group must be one of A+, A-, B+, B-, AB+, AB-, O+, O-',
    }),
  }),
  presentAddress: z.string(),
  permanentAddress: z.string(),
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  profileImg: z.string().optional(),
  isActive: z
    .enum(['active', 'blocked'], {
      errorMap: () => ({ message: 'Status must be either active or blocked' }),
    })
    .default('active'),
  isDeleted: z.boolean(),
});

export default studentSchema;
