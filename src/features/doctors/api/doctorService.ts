import { apiGet } from "@/lib/api/apiClient";
import type { Doctor } from "@/types";

// Loads the doctors list, filtered by search text and specialization when given.
export async function getDoctors(search = "", specialization = ""): Promise<Doctor[]> {
  const query = new URLSearchParams();

  if (search) query.set("search", search);
  if (specialization) query.set("specialization", specialization);

  const queryText = query.toString();
  const data = await apiGet(`/doctors${queryText ? `?${queryText}` : ""}`);

  return data.doctors;
}
