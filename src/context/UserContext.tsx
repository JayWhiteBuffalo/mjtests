'use client';

import { createContext, useContext, useState } from 'react';
import UserDto from '@/data/UserDto';

const UserContext = createContext(null);

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children, initialUser }) => {
  const [user, setUser] = useState(initialUser);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
