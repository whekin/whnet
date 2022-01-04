import React from 'react';
import { Box, TextField, Stack, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoginProps {}

export const Login = (props: LoginProps) => {
  const onSubmit = (data: any) => {
    console.log(JSON.stringify(data, null, 2));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  return (
    <Box component="form" noValidate autoComplete="off">
      <Stack spacing={2}>
        <TextField
          type="text"
          label="nickname"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('nickname')}
          error={!!errors['nickname']}
          helperText={errors['nickname']?.message}
          required
        />
        <TextField
          type="password"
          label="password"
          autoComplete="current-password"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('password')}
          error={!!errors['password']}
          helperText={errors['password']?.message}
          required
        />
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Login or sign up
        </Button>
      </Stack>
    </Box>
  );
};

export default Login;
