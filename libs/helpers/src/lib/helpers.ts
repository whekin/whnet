/* eslint-disable import/prefer-default-export */
import { useApolloClient } from '@apollo/client';
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

export const useUserAuthNickname = () => {
  const token = useReadLocalStorage<string | null>('token');

  if (token) {
    const { nickname } = decodeJwt<{ nickname: string }>(token);

    return nickname;
  }

  return '';
};

export const getBearerToken = () => {
  const token = JSON.parse(localStorage.getItem('token') as string);

  return token ? `Bearer ${token}` : '';
};
