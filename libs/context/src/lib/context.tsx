import React, { createContext, useMemo, useContext } from 'react';

import { useUserAuthNickname } from '@whnet/helpers';

export interface UserContextFields {
  nickname: string;
}

export const defaultContext: UserContextFields = {
  nickname: '',
};

export const UserContext = createContext(defaultContext);

export const UserContextProvider: React.FC = ({ children }) => {
  const nickname = useUserAuthNickname()!;

  const value = useMemo(() => ({ nickname }), [nickname]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserNickname = () => useContext(UserContext).nickname;

export const AppContextProvider = UserContextProvider;
