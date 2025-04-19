import * as Yup from 'yup';

export const ROLES = [
  'USER',
  'ADMIN',
  'AUDITOR',
  'ANALYST',
  'EXECUTIVE',
  'VIEWER',
] as const;
type Role = typeof ROLES[number];

const passwordRules = {
  min: 6,
  max: 40,
};

const passwordSchema = Yup.string()
  .required('Password is required')
  .min(passwordRules.min, `Password must be at least ${passwordRules.min} characters`)
  .max(passwordRules.max, `Password must not exceed ${passwordRules.max} characters`);

// Logged-in user validation
export const LoggedInUserSchema = Yup.object({
  id: Yup.number().required('ID is required'),
  email: Yup.string().required('Email is required').email('Email is invalid').trim(),
  role: Yup.mixed<Role>()
    .oneOf(ROLES, 'Role is not valid')
    .required('Role is required'),
}).noUnknown(true, 'Unknown field in logged-in user object');

// Sign-up user validation
export const SignUpUserSchema = Yup.object({
  firstName: Yup.string().required('First name is required').trim(),
  lastName: Yup.string().required('Last name is required').trim(),
  email: Yup.string().required('Email is required').email('Email is invalid').trim()
    .lowercase(),
  username: Yup.string().required('Username is required').trim(),
  password: passwordSchema,
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Confirm Password does not match'),
}).noUnknown(true, 'Unknown field in sign-up object');

// Change-password validation
export const ChangePasswordUserSchema = Yup.object({
  oldPassword: Yup.string().required('Old Password is required'),
  password: passwordSchema.notOneOf([
    Yup.ref('oldPassword'),
  ], 'New password must be different from old password'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Confirm Password does not match'),
}).noUnknown(true, 'Unknown field in change-password object');
