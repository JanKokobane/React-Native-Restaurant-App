import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    const mockUser: User = {
      id: '1',
      name: 'John',
      surname: 'Doe',
      email: email,
      phone: '+1234567890',
      address: '123 Main Street, Apt 4B, New York, NY 10001',
      cardNumber: '4532 **** **** 1234',
      cardExpiry: '12/25',
      cardCVV: '***',
    };
    setUser(mockUser);
    return true;
  };

  const register = async (
    userData: Omit<User, 'id'>
  ): Promise<boolean> => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substring(7),
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
