// The choices shown in the profile forms, and the one rule the models cannot check.
export const MOBILE_NUMBER_PATTERN = /^[0-9]{10}$/;

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// The value is what we save, the label is what the user sees.
export const PATIENT_GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// The Doctor model allows only these two, so the doctor form shows only these two.
export const DOCTOR_GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const SLOT_DURATIONS = [10, 15, 20, 30];

// The break (gap) a doctor can keep between two slots, in minutes.
export const BREAK_DURATIONS = [0, 5, 10, 15];

export function getGenderLabel(savedValue: string) {
  const match = PATIENT_GENDER_OPTIONS.find((option) => option.value === savedValue);
  return match ? match.label : savedValue;
}
