import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  register: (
    userData: Omit<User, 'id'> & { password: string }
  ) => Promise<{ success: boolean; message: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (
    updates: Partial<User>
  ) => Promise<{ success: boolean; message: string }>;
  deleteAccount: () => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const API_URL =
    'https://react-native-restaurant-app-backend.onrender.com/api';

  const register = async (
    userData: Omit<User, 'id'> & { password: string }
  ) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          phone: userData.phone,
          streetName: userData.streetName,
          streetNumber: userData.streetNumber,
          addressLine2: userData.addressLine2 || '',
          fullAddress: userData.fullAddress,
          password: userData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setUser({ ...userData, id: data.user.id });
        return { success: true, message: 'Registration successful!' };
      } else {
        return {
          success: false,
          message: data.message || 'Registration failed',
        };
      }
    } catch (err: any) {
      console.log('Register Error:', err);
      return {
        success: false,
        message: 'An error occurred during registration',
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err: any) {
      console.log('Login Error:', err);
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { success: false, message: 'No user logged in' };
    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        return { success: true, message: 'Profile updated successfully!' };
      } else {
        return { success: false, message: data.error || 'Update failed' };
      }
    } catch (err: any) {
      console.log('Update Error:', err);
      return { success: false, message: 'An error occurred during update' };
    }
  };

  const deleteAccount = async () => {
    if (!user) return { success: false, message: 'No user logged in' };
    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUser(null);
        return { success: true, message: 'Account deleted successfully!' };
      } else {
        const data = await res.json();
        return { success: false, message: data.error || 'Delete failed' };
      }
    } catch (err: any) {
      console.log('Delete Error:', err);
      return { success: false, message: 'An error occurred during deletion' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
