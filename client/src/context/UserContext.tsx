/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getUsers } from '../api';
import type { User } from '../types';

interface UserContextType {
  users: User[];
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
      if (data.length > 0) setSelectedUserId(data[0].id);
    });
  }, []);

  return (
    <UserContext.Provider value={{ users, selectedUserId, setSelectedUserId }}>
      {children}
    </UserContext.Provider>
  );
}