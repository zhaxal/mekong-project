import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextValue {
  isLoggedIn: boolean;
  loading: boolean;
  logout: () => void;
  login: (token: string) => void;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  loading: true,
  logout: () => {},
  login: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const adminSecret = import.meta.env.VITE_ADMIN_SECRET || "admin";

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === adminSecret) {
      login(token);
    } else {
      logout();
    }

    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
  };

  const login = (token: string | null) => {
    if (!token) return;

    localStorage.setItem("token", token);
    setIsLoggedIn(true);

    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, login, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
