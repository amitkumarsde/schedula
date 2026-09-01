import { readOptionalText } from "@/lib/utils/apiRequest";
import { MOBILE_NUMBER_PATTERN, PATIENT_GENDER_OPTIONS, BLOOD_GROUPS } from "@/lib/utils/profileOptions";
import { CheckResult, fail, ok } from "@/lib/profile/checkResult";

// Checks the patient "Basic info" tab. The model also checks gender and the age range.
export function validatePatientBasic(body: Record<string, unknown>): CheckResult {
  const fullName = readOptionalText(body.fullName);
  const gender = readOptionalText(body.gender);
  const mobileNumber = readOptionalText(body.mobileNumber);
  const bloodGroup = readOptionalText(body.bloodGroup);
  const city = readOptionalText(body.city);
  const profileImage = readOptionalText(body.profileImage);

  const age = Number(body.age);
  const weight = Number(body.weight);

  if (fullName.length < 3 || fullName.length > 60) {
    return fail("Full name must be between 3 and 60 characters");
  }

  if (!Number.isInteger(age) || age < 1 || age > 120) {
    return fail("Age must be a whole number between 1 and 120");
  }

  const allowedGenders = PATIENT_GENDER_OPTIONS.map((option) => option.value);
  if (!allowedGenders.includes(gender)) {
    return fail("Please select male, female or other as gender");
  }

  if (!MOBILE_NUMBER_PATTERN.test(mobileNumber)) {
    return fail("Mobile number must be exactly 10 digits");
  }

  if (!Number.isFinite(weight) || weight < 1 || weight > 500) {
    return fail("Weight must be between 1 and 500 Kg");
  }

  if (bloodGroup && !BLOOD_GROUPS.includes(bloodGroup)) {
    return fail("Please select a blood group from the list");
  }

  if (profileImage && !profileImage.startsWith("https://")) {
    return fail("Photo link must start with https://");
  }

  return ok({ fullName, age, gender, mobileNumber, weight, bloodGroup, city, profileImage });
}

function toCleanList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function validatePatientMedical(body: Record<string, unknown>): CheckResult {
  const allergies = toCleanList(body.allergies);
  const diseases = toCleanList(body.diseases);

  if (allergies.length > 30 || diseases.length > 30) {
    return fail("You can add at most 30 items in a list");
  }

  for (const item of [...allergies, ...diseases]) {
    if (item.length > 100) return fail("Each item must be 100 characters or less");
  }

  return ok({ allergies, diseases });
}
