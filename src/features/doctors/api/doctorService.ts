import { apiGet } from "@/lib/api/apiClient";
import type { Doctor } from "@/types";

// Loads the doctors list with optional search and filter.
export async function getDoctors(search = "", specialization = ""): Promise<Doctor[]> {
  const query = new URLSearchParams();

  if (search) query.set("search", search);
  if (specialization) query.set("specialization", specialization);

  const queryText = query.toString();
  const data = await apiGet(`/doctors${queryText ? `?${queryText}` : ""}`);

  return data.doctors;
}

// Loads one doctor by id.
export async function getDoctorById(doctorId: string): Promise<Doctor> {
  const data = await apiGet(`/doctors/${doctorId}`);
  return data.doctor;
}
