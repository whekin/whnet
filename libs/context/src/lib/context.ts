import { createContext } from 'react';

export interface Context {
  userNickname: string;
}

export const defaultContext: Context = {
  userNickname: '',
};

export default createContext(defaultContext);
