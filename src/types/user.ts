export type UserRole = "patient" | "doctor";

export type LoggedInUser = {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isProfileComplete: boolean;
};
