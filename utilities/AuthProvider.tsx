import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './types';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  logout: () => Promise<void>;
}



export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}


const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem('currentUser');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    };

    loadUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
