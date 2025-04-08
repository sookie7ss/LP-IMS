import React, { useState, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
interface UserContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);
// Mock users data
const mockUsers: User[] = [{
  id: 'user-1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  active: true
}
// Add more mock users as needed
];
export const UserProvider: React.FC<{
  children: ReactNode;
}> = ({
  children
}) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]); // For demo, auto-login as admin
  const login = async (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.active);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };
  const logout = () => {
    setCurrentUser(null);
  };
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
  };
  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === id ? {
      ...user,
      ...userData
    } : user));
  };
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };
  return <UserContext.Provider value={{
    currentUser,
    login,
    logout,
    users,
    addUser,
    updateUser,
    deleteUser
  }}>
      {children}
    </UserContext.Provider>;
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};