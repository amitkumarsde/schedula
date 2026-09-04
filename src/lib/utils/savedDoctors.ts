// The patient's saved (favourite) doctors, kept in the browser like the login session.
const STORAGE_KEY = "schedula_saved_doctors";

// Reads the saved doctor ids. Returns an empty list on the server or when nothing is saved.
export function getSavedDoctorIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Adds the doctor if it is not saved, or removes it if it is, then returns the new list.
export function toggleSavedDoctor(doctorId: string): string[] {
  const current = getSavedDoctorIds();
  const next = current.includes(doctorId)
    ? current.filter((id) => id !== doctorId)
    : [...current, doctorId];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
