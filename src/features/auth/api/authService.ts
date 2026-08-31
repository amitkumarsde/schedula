import { apiPost } from "@/lib/api/apiClient";
import type { LoggedInUser, UserRole } from "@/types";

// Creates a new account and returns the logged in user.
export async function signupUser(
  fullName: string,
  email: string,
  password: string,
  role: UserRole
): Promise<LoggedInUser> {
  const data = await apiPost("/auth/signup", { fullName, email, password, role });
  return data.user;
}

// Checks the email and password and returns the logged in user.
export async function loginUser(email: string, password: string): Promise<LoggedInUser> {
  const data = await apiPost("/auth/login", { email, password });
  return data.user;
}
