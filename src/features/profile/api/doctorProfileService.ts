import { apiGet, apiPut } from "@/lib/api/apiClient";
import type { LoggedInUser, Doctor } from "@/types";

// Loads the logged in doctor's own profile.
export async function getDoctorProfile(userId: string): Promise<Doctor | null> {
  const data = await apiGet(`/profile/doctor?userId=${encodeURIComponent(userId)}`);
  return data.doctorProfile;
}

// Saves one tab of the doctor profile and returns the updated user.
export async function saveDoctorProfileSection(
  userId: string,
  section: string,
  fields: Record<string, unknown>
): Promise<LoggedInUser> {
  const data = await apiPut("/profile/doctor", { userId, section, ...fields });
  return data.user;
}
