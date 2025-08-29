
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, signOutUser } from '../services/auth';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  cellPhoneNumber?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
  signOut: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkUser();
  }, []);

  const signOut = () => {
    signOutUser();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;
