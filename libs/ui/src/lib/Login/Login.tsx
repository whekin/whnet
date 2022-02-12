import React, { useState, useEffect } from 'react';
import {
  Box,
  InputAdornment,
  IconButton,
  FilledInput,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import {
  useLoginOrSignUpMutation,
  useFindUserNicknameLazyQuery,
} from '@whnet/data-access';

import {
  loginValidationSchema,
  signUpValidationSchema,
  isNicknameValidSync,
} from '@whnet/validation';

import { useLogin } from '@whnet/helpers';

const CHECK_NICKNAME_EXISTANCE_DELAY = 150;

type FormValues = {
  nickname: string;
  password: string;
  confirmPassword: string;
};

enum EnterMode {
  DEFAULT,
  LOGIN,
  SIGNUP,
}

const getEnterText = (enterMode: EnterMode) => {
  switch (enterMode) {
    case EnterMode.LOGIN:
      return 'Login';
    case EnterMode.SIGNUP:
      return 'Sign up';
    default:
      return 'Enter Whnet';
  }
};

export const Login = () => {
  const proceedLogin = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading, data, error }] = useLoginOrSignUpMutation();
  const [
    checkIfUserExist,
    { loading: loadingUser, data: userData, error: userFetchError },
  ] = useFindUserNicknameLazyQuery();
  const [enterMode, setEnterMode] = useState(EnterMode.DEFAULT);
  const { enqueueSnackbar } = useSnackbar();
  const validationSchema =
    enterMode === EnterMode.LOGIN
      ? loginValidationSchema
      : signUpValidationSchema;
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
  });
  const showNickname = watch('nickname');

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValues> = async (submitData) => {
    const { nickname, password } = submitData;

    login({ variables: { nickname, password } });
  };

  useEffect(() => {
    if (data) {
      proceedLogin(data.loginOrSignUp.token);
    }
  }, [data, proceedLogin]);

  useEffect(() => {
    if (!userData) return;

    if (!userData.findFirstUser?.nickname) {
      if (enterMode !== EnterMode.SIGNUP) {
        setEnterMode(EnterMode.SIGNUP);
      }
    } else if (enterMode !== EnterMode.LOGIN) {
      setEnterMode(EnterMode.LOGIN);
    }
  }, [userData, enterMode]);

  useEffect(() => {
    if (!showNickname || !isNicknameValidSync(showNickname)) return;

    const delay = setTimeout(() => {
      checkIfUserExist({
        variables: {
          nickname: showNickname,
        },
      });
    }, CHECK_NICKNAME_EXISTANCE_DELAY);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(delay);
  }, [showNickname, checkIfUserExist, validationSchema]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar('Incorrect user credentials!', { variant: 'error' });
      setError(
        'password',
        {
          type: 'manual',
          message: 'Incorrect password!',
        },
        { shouldFocus: true }
      );
    }
  }, [error, enqueueSnackbar, setError]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 1, width: '100%' }}
    >
      <FormControl fullWidth variant="filled" margin="normal">
        <InputLabel
          error={!!errors['nickname']}
          htmlFor="filled-adornment-nickname"
        >
          Nickname *
        </InputLabel>
        <FilledInput
          id="filled-adornment-nickname"
          type="text"
          error={!!errors['nickname']}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('nickname')}
          required
          endAdornment={
            <InputAdornment position="end">
              {loadingUser && <CircularProgress size={20} />}
            </InputAdornment>
          }
        />
        <FormHelperText error>{errors['nickname']?.message}</FormHelperText>
      </FormControl>
      <FormControl fullWidth variant="filled" margin="normal">
        <InputLabel
          error={!!errors['password']}
          htmlFor="filled-adornment-password"
        >
          Password *
        </InputLabel>
        <FilledInput
          id="filled-adornment-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          error={!!errors['password']}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('password')}
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText error>{errors['password']?.message}</FormHelperText>
      </FormControl>
      {enterMode === EnterMode.SIGNUP && (
        <FormControl fullWidth variant="filled" margin="normal">
          <InputLabel
            error={!!errors['confirmPassword']}
            htmlFor="filled-adornment-confirm-password"
          >
            Confirm password *
          </InputLabel>
          <FilledInput
            id="filled-adornment-confirm-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            error={!!errors['confirmPassword']}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('confirmPassword')}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText error>
            {errors['confirmPassword']?.message}
          </FormHelperText>
        </FormControl>
      )}
      <LoadingButton
        type="submit"
        variant="contained"
        loading={loading}
        sx={{ mt: 1 }}
        fullWidth
      >
        {getEnterText(enterMode)}
      </LoadingButton>
    </Box>
  );
};

export default Login;
