import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/types";  
import { auth, db } from "@/firebaseConfig";
import * as React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (userData: Omit<User, "id"> & { password: string }) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string }>;
  deleteAccount: () => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) setUser(snap.data() as User);
        else setUser(null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async (userData: Omit<User, "id"> & { password: string }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const uid = cred.user.uid;

      const { image, ...rest } = userData;
      const profile: User = {
        ...rest,
        id: uid,
        image: image ?? "" 
      };

      await setDoc(doc(db, "users", uid), profile);

      setUser(profile);
      return { success: true, message: "Registration successful!" };
    } catch (err: any) {
      console.error("Registration error:", err);

      let message = "Registration failed";
      if (err.code === "auth/email-already-in-use") message = "Email already in use";
      else if (err.code === "auth/invalid-email") message = "Invalid email format";
      else if (err.code === "auth/weak-password") message = "Password is too weak";
      else if (err.code === "permission-denied") message = "You don't have permission to write user data";
      else if (err.message) message = err.message;

      return { success: false, message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (snap.exists()) {
        setUser(snap.data() as User);
        return { success: true, message: "Login successful!" };
      } else return { success: false, message: "User profile not found" };
    } catch (err: any) {
      let message = "Email or password is incorrect";
      if (err.code === "auth/wrong-password") message = "Incorrect password";
      if (err.code === "auth/user-not-found") message = "No account found";
      return { success: false, message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { success: false, message: "No user logged in" };
    try {
      await updateDoc(doc(db, "users", user.id), updates);
      setUser({ ...user, ...updates });
      return { success: true, message: "Profile updated successfully!" };
    } catch (err: any) {
      return { success: false, message: err.message || "Update failed" };
    }
  };

  const deleteAccount = async () => {
    if (!user) return { success: false, message: "No user logged in" };
    try {
      await deleteDoc(doc(db, "users", user.id));
      if (auth.currentUser) await deleteUser(auth.currentUser);
      setUser(null);
      return { success: true, message: "Account deleted successfully!" };
    } catch (err: any) {
      return { success: false, message: err.message || "Delete failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, register, login, logout, updateProfile, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
