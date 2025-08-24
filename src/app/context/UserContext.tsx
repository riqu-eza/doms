"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

type User = {
  userId: string;
  role: string;
  orgId?: string;
  vendorId?: string;
  [key: string]: unknown;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwtDecode(token);
        setUser({
          userId: decoded.userId,
          role: decoded.role,
          orgId: decoded.orgId,
          vendorId: decoded.vendorId,
        });
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <UserContext.Provider value={{ user, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ Custom hook for easy access
export const useUser = () => useContext(UserContext);
