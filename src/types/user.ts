export type UserRole = "patient" | "doctor";

// The user details the API sends back after signup or login.
export type LoggedInUser = {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isProfileComplete: boolean;
};
