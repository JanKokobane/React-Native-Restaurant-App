import { createContext, useContext, useState, ReactNode } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // REGISTER
  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    try {
      // Check if user already exists
      const userDoc = await getDoc(doc(db, 'users', userData.email));
      if (userDoc.exists()) {
        return { success: false, message: 'Email already registered. Please login.' };
      }

      // Create user in Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

      // Save extra info in Firestore
      await setDoc(doc(db, 'users', res.user.uid), {
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
      });

      setUser({ ...userData, id: res.user.uid });
      return { success: true, message: 'Registration successful!' };
    } catch (err: any) {
      console.log('Register Error:', err);
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  // LOGIN
  const login = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      const userDoc = await getDoc(doc(db, 'users', res.user.uid));
      const data = userDoc.data();

      if (data) setUser({ id: res.user.uid, ...data } as User);

      return { success: true, message: 'Login successful!' };
    } catch (err: any) {
      console.log('Login Error:', err);
      return { success: false, message: err.message || 'Login failed. Please check your credentials.' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
