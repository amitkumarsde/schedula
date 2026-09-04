import { apiGet, apiPut } from "@/lib/api/apiClient";
import type { LoggedInUser, Patient } from "@/types";

// Loads one patient's profile by their user id.
export async function getPatientProfile(userId: string): Promise<Patient | null> {
  const data = await apiGet(`/profile/patient?userId=${encodeURIComponent(userId)}`);
  return data.patientProfile;
}

// Saves one section of the patient's profile to the API.
export async function savePatientProfileSection(
  userId: string,
  section: string,
  fields: Record<string, unknown>
): Promise<LoggedInUser> {
  const data = await apiPut("/profile/patient", { userId, section, ...fields });
  return data.user;
}
