"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { readLoggedInUser, saveLoggedInUser, clearLoggedInUser } from "@/lib/utils/session";
import type { LoggedInUser } from "@/types";

type Session = { user: LoggedInUser | null; isLoading: boolean };

type AuthValue = Session & {
  login: (user: LoggedInUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

// Keeps the logged in user in one place, so the header updates the moment someone logs in.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ user: null, isLoading: true });

  // The saved user is read after mounting, because the server has no browser storage.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession({ user: readLoggedInUser(), isLoading: false });
  }, []);

  function login(user: LoggedInUser) {
    saveLoggedInUser(user);
    setSession({ user, isLoading: false });
  }

  function logout() {
    clearLoggedInUser();
    setSession({ user: null, isLoading: false });
  }

  return (
    <AuthContext.Provider value={{ ...session, login, logout }}>{children}</AuthContext.Provider>
  );
}

// Gives any component the logged in user and the login / logout actions.
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
