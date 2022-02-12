/* eslint-disable import/prefer-default-export */
import { useApolloClient } from '@apollo/client';
import { useLocation, useNavigate, Location } from 'react-router-dom';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import decodeJwt from 'jwt-decode';

export const useLogout = () => {
  const client = useApolloClient();
  const [, setToken] = useLocalStorage('token', null);

  return () => {
    setToken(null);
    setTimeout(() => client.resetStore(), 0);
  };
};
interface StateType extends Location {
  state:
    | {
        from:
          | {
              pathname: string | undefined;
            }
          | undefined;
      }
    | undefined;
}

export const useLogin = () => {
  const { state } = useLocation() as StateType;
  const navigate = useNavigate();
  const [, setToken] = useLocalStorage<string | null>('token', null);

  const from = state?.from?.pathname || '/';

  return (token: string) => {
    setToken(() => token);
    navigate(from, { replace: true });
  };
};

export const useUserAuthNickname = () => {
  const token = useReadLocalStorage<string | null>('token');

  if (token) {
    const { nickname } = decodeJwt<{ nickname: string }>(token);

    return nickname;
  }

  return null;
};

export const getBearerToken = () => {
  const token = JSON.parse(localStorage.getItem('token') as string);

  return token ? `Bearer ${token}` : '';
};
