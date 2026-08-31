import { HydratedDocument } from "mongoose";
import type { UserDocument } from "@/lib/models/User";

// Picks only the safe user fields, so the password never leaves the server.
export function toSafeUser(user: HydratedDocument<UserDocument>) {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isProfileComplete: user.isProfileComplete,
  };
}
