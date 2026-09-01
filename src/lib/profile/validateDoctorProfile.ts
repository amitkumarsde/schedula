import { readOptionalText } from "@/lib/utils/apiRequest";
import { MOBILE_NUMBER_PATTERN, DOCTOR_GENDER_OPTIONS, WEEK_DAYS, SLOT_DURATIONS } from "@/lib/utils/profileOptions";
import { SPECIALIZATIONS } from "@/lib/utils/specializations";
import { CheckResult, fail, ok } from "@/lib/profile/checkResult";

// A time like "09:30" in 24 hour form.
const TIME_PATTERN = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

// Checks the doctor "Basic info" tab. The model also checks the allowed gender.
export function validateDoctorBasic(body: Record<string, unknown>): CheckResult {
  const fullName = readOptionalText(body.fullName);
  const gender = readOptionalText(body.gender);
  const mobileNumber = readOptionalText(body.mobileNumber);
  const city = readOptionalText(body.city);
  const profileImage = readOptionalText(body.profileImage);

  if (fullName.length < 3 || fullName.length > 60) {
    return fail("Full name must be between 3 and 60 characters");
  }

  const allowedGenders = DOCTOR_GENDER_OPTIONS.map((option) => option.value);
  if (!allowedGenders.includes(gender)) {
    return fail("Please select male or female as gender");
  }

  if (!MOBILE_NUMBER_PATTERN.test(mobileNumber)) {
    return fail("Mobile number must be exactly 10 digits");
  }

  if (city.length < 2 || city.length > 60) {
    return fail("City must be between 2 and 60 characters");
  }

  if (profileImage && !profileImage.startsWith("https://")) {
    return fail("Photo link must start with https://");
  }

  return ok({ fullName, gender, mobileNumber, city, profileImage });
}

export function validateDoctorProfessional(body: Record<string, unknown>): CheckResult {
  const specialization = readOptionalText(body.specialization);
  const qualification = readOptionalText(body.qualification);
  const about = readOptionalText(body.about);
  const hospitalName = readOptionalText(body.hospitalName);

  const experienceYears = Number(body.experienceYears);

  if (!SPECIALIZATIONS.includes(specialization)) {
    return fail("Please select a specialization from the list");
  }

  if (qualification.length < 2 || qualification.length > 100) {
    return fail("Qualification must be between 2 and 100 characters");
  }

  if (!Number.isInteger(experienceYears) || experienceYears < 0 || experienceYears > 70) {
    return fail("Experience must be a whole number between 0 and 70");
  }

  if (about.length > 500) return fail("About must be 500 characters or less");
  if (hospitalName.length > 100) return fail("Hospital name is too long");

  return ok({ specialization, qualification, experienceYears, about, hospitalName });
}

export function validateDoctorAvailability(body: Record<string, unknown>): CheckResult {
  const days = Array.isArray(body.availableDays) ? body.availableDays : [];
  const morningStartTime = readOptionalText(body.morningStartTime);
  const morningEndTime = readOptionalText(body.morningEndTime);
  const eveningStartTime = readOptionalText(body.eveningStartTime);
  const eveningEndTime = readOptionalText(body.eveningEndTime);

  const slotDurationMinutes = Number(body.slotDurationMinutes);
  const consultationFee = Number(body.consultationFee);
  const isAvailable = body.isAvailable === true;

  // Keep only real day names, so a wrong value can never be saved.
  const availableDays = days.filter((day): day is string => WEEK_DAYS.includes(day as string));

  const allTimes = [morningStartTime, morningEndTime, eveningStartTime, eveningEndTime];
  if (allTimes.some((time) => time && !TIME_PATTERN.test(time))) {
    return fail("Time must be in the 24 hour form, like 09:30");
  }

  if (!SLOT_DURATIONS.includes(slotDurationMinutes)) {
    return fail("Please pick a slot length from the list");
  }

  if (!Number.isFinite(consultationFee) || consultationFee < 0 || consultationFee > 100000) {
    return fail("Consultation fee must be between 0 and 100000");
  }

  // A doctor cannot be listed for booking without at least one consulting day.
  if (isAvailable && availableDays.length === 0) {
    return fail("Pick at least one day before you turn on booking");
  }

  return ok({
    availableDays,
    morningStartTime,
    morningEndTime,
    eveningStartTime,
    eveningEndTime,
    slotDurationMinutes,
    consultationFee,
    isAvailable,
  });
}
