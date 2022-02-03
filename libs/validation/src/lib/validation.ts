import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  nickname: Yup.string()
    .required('Nickname is required')
    .min(3, 'Nickname must be at least 3 characters')
    .max(20, 'Nickname must not exceed 20 characters')
    .matches(
      /^[a-z_]+$/,
      'Nickname must consist of lowercase latin characters and underscores'
    ),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must not exceed 50 characters'),
});

export const signUpValidationSchema = loginValidationSchema.shape({
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords don't match!")
    .required('Required'),
});

export const nicknameValidationSchema = Yup.reach(
  loginValidationSchema,
  'nickname'
);

export const isNicknameValidSync = (nickname: string) =>
  nicknameValidationSchema.isValidSync(nickname);
