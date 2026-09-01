import type { LoggedInUser } from "@/types";

const STORAGE_KEY = "schedula_user";

export function saveLoggedInUser(user: LoggedInUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

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

export function clearLoggedInUser() {
  localStorage.removeItem(STORAGE_KEY);
}
