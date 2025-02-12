import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const UserSchema = Yup.object({
  id: Yup.number().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  role: Yup.string().oneOf(['USER', 'ADMIN']).required(),
});

export const SignInSchema = Yup.object({
  credentials: Yup.object({
    email: Yup.string().required(),
    password: Yup.string().required(),
  }),
});
