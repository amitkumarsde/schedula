import { HydratedDocument } from "mongoose";
import { sendError } from "@/lib/utils/apiResponse";
import User, { UserDocument } from "@/lib/models/User";
import type { UserRole } from "@/types";

type FoundUser =
  | { user: HydratedDocument<UserDocument>; error: null }
  | { user: null; error: ReturnType<typeof sendError> };

// Loads the user and checks their role. The route does `if (error) return error` and then uses user.
export async function findUserWithRole(userId: string, role: UserRole): Promise<FoundUser> {
  const user = await User.findById(userId);
  if (!user) return { user: null, error: sendError("User not found", 404) };
  if (user.role !== role) return { user: null, error: sendError(`This user is not a ${role}`, 403) };
  return { user, error: null };
}
