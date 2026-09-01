import { apiGet, apiPut } from "@/lib/api/apiClient";
import type { LoggedInUser, Patient } from "@/types";

// Loads the logged in patient's own profile.
export async function getPatientProfile(userId: string): Promise<Patient | null> {
  const data = await apiGet(`/profile/patient?userId=${encodeURIComponent(userId)}`);
  return data.patientProfile;
}

// Saves one tab of the patient profile and returns the updated user.
export async function savePatientProfileSection(
  userId: string,
  section: string,
  fields: Record<string, unknown>
): Promise<LoggedInUser> {
  const data = await apiPut("/profile/patient", { userId, section, ...fields });
  return data.user;
}
