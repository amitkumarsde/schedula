import { readOptionalText } from "@/lib/utils/apiRequest";
import { MOBILE_NUMBER_PATTERN, GENDER_OPTIONS, WEEK_DAYS, SLOT_DURATIONS, BREAK_DURATIONS } from "@/lib/utils/profileOptions";
import { isValidFullName, FULL_NAME_MESSAGE, isHttpsUrl } from "@/lib/utils/validation";
import { SPECIALIZATIONS } from "@/lib/utils/specializations";
import { VISIT_TYPES, MEET_TYPES, CONSULT_TYPES } from "@/lib/utils/appointmentOptions";
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

  if (!isValidFullName(fullName)) {
    return fail(FULL_NAME_MESSAGE);
  }

  const allowedGenders = GENDER_OPTIONS.map((option) => option.value);
  if (!allowedGenders.includes(gender)) {
    return fail("Please select male, female or other as gender");
  }

  if (!MOBILE_NUMBER_PATTERN.test(mobileNumber)) {
    return fail("Mobile number must be exactly 10 digits");
  }

  if (city.length < 2 || city.length > 60) {
    return fail("City must be between 2 and 60 characters");
  }

  if (profileImage && !isHttpsUrl(profileImage)) {
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

// Keeps only the values that are in the allowed list, so a wrong value is never saved.
function keepAllowed(value: unknown, allowed: string[]): string[] {
  if (!Array.isArray(value)) return [];
  return allowed.filter((one) => value.includes(one));
}

export function validateDoctorAvailability(body: Record<string, unknown>): CheckResult {
  const days = Array.isArray(body.availableDays) ? body.availableDays : [];
  const startTime = readOptionalText(body.startTime);
  const endTime = readOptionalText(body.endTime);

  const visitTypes = keepAllowed(body.visitTypes, VISIT_TYPES);
  const meetTypes = keepAllowed(body.meetTypes, MEET_TYPES);
  const consultTypes = keepAllowed(body.consultTypes, CONSULT_TYPES);

  const slotDuration = Number(body.slotDuration);
  const breakDuration = Number(body.breakDuration) || 0;
  const consultationFee = Number(body.consultationFee);
  const isAvailable = body.isAvailable === true;

  // Keep only real day names, so a wrong value can never be saved.
  const availableDays = days.filter((day): day is string => WEEK_DAYS.includes(day as string));

  if ([startTime, endTime].some((time) => time && !TIME_PATTERN.test(time))) {
    return fail("Time must be in the 24 hour form, like 09:30");
  }

  // When both times are set, the day must start before it ends.
  if (startTime && endTime && startTime >= endTime) {
    return fail("Start time must be before the end time");
  }

  if (!SLOT_DURATIONS.includes(slotDuration)) {
    return fail("Please pick a slot length from the list");
  }

  if (!BREAK_DURATIONS.includes(breakDuration)) {
    return fail("Please pick a break length from the list");
  }

  if (!Number.isFinite(consultationFee) || consultationFee < 0 || consultationFee > 100000) {
    return fail("Consultation fee must be between 0 and 100000");
  }

  // A doctor cannot be listed for booking without at least one consulting day.
  if (isAvailable && availableDays.length === 0) {
    return fail("Pick at least one day before you turn on booking");
  }

  // Without a start and end time there are no slots to book, so both are required to list.
  if (isAvailable && (!startTime || !endTime)) {
    return fail("Add a start and end time before you turn on booking");
  }

  // A patient must have at least one choice in each of the three lists.
  if (isAvailable && (!visitTypes.length || !meetTypes.length || !consultTypes.length)) {
    return fail("Pick at least one visit type, meet type and consult type");
  }

  return ok({
    availableDays,
    startTime,
    endTime,
    slotDuration,
    breakDuration,
    visitTypes,
    meetTypes,
    consultTypes,
    consultationFee,
    isAvailable,
  });
}
