import type { LoggedInUser } from "@/types";

const STORAGE_KEY = "schedula_user";

// Saves the logged in user so a page refresh does not log them out.
export function saveLoggedInUser(user: LoggedInUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

// Reads the saved user, or null when nobody is logged in.
export function readLoggedInUser(): LoggedInUser | null {
  // localStorage does not exist while Next.js renders on the server.
  if (typeof window === "undefined") return null;

  const savedText = localStorage.getItem(STORAGE_KEY);
  if (!savedText) return null;

  try {
    return JSON.parse(savedText);
  } catch {
    return null;
  }
}

// Removes the saved user on logout.
export function clearLoggedInUser() {
  localStorage.removeItem(STORAGE_KEY);
}
