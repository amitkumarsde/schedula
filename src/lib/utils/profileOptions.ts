// The choices shown in the profile forms, and the one rule the models cannot check.
export const MOBILE_NUMBER_PATTERN = /^[0-9]{10}$/;

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const PATIENT_GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const DOCTOR_GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const SLOT_DURATIONS = [10, 15, 20, 30];

export const BREAK_DURATIONS = [5, 10, 15, 20];

export function getGenderLabel(savedValue: string) {
  const match = PATIENT_GENDER_OPTIONS.find((option) => option.value === savedValue);
  return match ? match.label : savedValue;
}
