import { createContext } from 'react';

export interface Context {
  userNickname: string | null;
}

export const defaultContext: Context = {
  userNickname: null,
};

export default createContext(defaultContext);
