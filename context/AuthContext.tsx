import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  register: (
    userData: Omit<User, "id"> & { password: string }
  ) => Promise<{ success: boolean; message: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const API_URL = "https://react-native-restaurant-app-backend.onrender.com/api/auth";

  const register = async (userData: Omit<User, "id"> & { password: string }) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          phone: userData.phone,
          streetName: userData.streetName,
          streetNumber: userData.streetNumber,
          addressLine2: userData.addressLine2 || "",
          fullAddress: userData.fullAddress, 
          password: userData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setUser({ ...userData, id: data.user.id });
        return { success: true, message: "Registration successful!" };
      } else {
        return { success: false, message: data.message || "Registration failed" };
      }
    } catch (err: any) {
      console.log("Register Error:", err);
      return { success: false, message: "An error occurred during registration" };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        return { success: true, message: "Login successful!" };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (err: any) {
      console.log("Login Error:", err);
      return { success: false, message: "An error occurred during login" };
    }
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, register, login, logout }}
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
