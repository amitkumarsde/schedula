"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { readLoggedInUser, saveLoggedInUser, clearLoggedInUser } from "@/lib/utils/session";
import type { LoggedInUser } from "@/types";

type Session = { user: LoggedInUser | null; isLoading: boolean };

type AuthValue = Session & {
  login: (user: LoggedInUser) => void;
  updateUser: (user: LoggedInUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ user: null, isLoading: true });

  // The saved user is read after mounting, because the server has no browser storage.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession({ user: readLoggedInUser(), isLoading: false });
  }, []);

  function saveUser(user: LoggedInUser) {
    saveLoggedInUser(user);
    setSession({ user, isLoading: false });
  }

  function logout() {
    clearLoggedInUser();
    setSession({ user: null, isLoading: false });
  }

  // login and updateUser do the same job, but the two names make the calling code easy to read.
  return (
    <AuthContext.Provider value={{ ...session, login: saveUser, updateUser: saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
