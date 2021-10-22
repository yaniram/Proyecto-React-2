import { createContext, useContext } from 'react';

export const UserContext = createContext(null);  // Contiene la información del usuario

export const useUser = () => {
  return useContext(UserContext);
};