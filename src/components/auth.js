import { createContext, useContext } from 'react';

export const AuthContext = createContext({userProfile:{}});

export function useAuth() {
  return useContext(AuthContext);
}