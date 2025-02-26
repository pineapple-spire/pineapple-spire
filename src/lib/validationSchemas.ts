import * as Yup from 'yup';

export const LoggedInUserSchema = Yup.object({
  id: Yup.number().required(),
  email: Yup.string().required(),
  role: Yup.string().oneOf(['USER', 'ADMIN', 'AUDITOR', 'ANALYST']).required(),
});

export const SignInSchema = Yup.object({
  credentials: Yup.object({
    email: Yup.string().required(),
    password: Yup.string().required(),
  }),
});
