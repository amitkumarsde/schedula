import { apiPost } from "@/lib/api/apiClient";
import type { LoggedInUser, UserRole } from "@/types";

// Creates a new account and returns the user.
export async function signupUser(
  fullName: string,
  email: string,
  password: string,
  role: UserRole
): Promise<LoggedInUser> {
  const data = await apiPost("/auth/signup", { fullName, email, password, role });
  return data.user;
}

// Logs the user in and returns the user.
export async function loginUser(email: string, password: string): Promise<LoggedInUser> {
  const data = await apiPost("/auth/login", { email, password });
  return data.user;
}
