// Helpers to build appointment time slots and to read dates. Used by the API and the pages.

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(totalMinutes: number) {
  return `${pad(Math.floor(totalMinutes / 60))}:${pad(totalMinutes % 60)}`;
}

// breakDuration is the gap left between one slot and the next.
export function makeSlots(
  startTime: string,
  endTime: string,
  slotDuration: number,
  breakDuration = 0
): string[] {
  if (!startTime || !endTime || !slotDuration) return [];

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const step = slotDuration + breakDuration;
  const slots: string[] = [];

  for (let time = start; time + slotDuration <= end; time += step) {
    slots.push(toTime(time));
  }

  return slots;
}

// Builds the slots straight from a doctor's saved timings.
export function makeSlotsForDoctor(doctor: {
  startTime: string;
  endTime: string;
  slotDuration: number;
  breakDuration: number;
}): string[] {
  return makeSlots(doctor.startTime, doctor.endTime, doctor.slotDuration, doctor.breakDuration);
}

export function formatSlotLabel(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${pad(minutes)} ${period}`;
}

export function weekdayName(dateText: string) {
  const [year, month, day] = dateText.split("-").map(Number);
  return WEEKDAYS[new Date(year, month - 1, day).getDay()];
}

// True when the doctor takes bookings and this date is one of their days.
export function isDoctorWorkingOn(
  doctor: { isAvailable: boolean; availableDays: string[] },
  dateText: string
) {
  return doctor.isAvailable && doctor.availableDays.includes(weekdayName(dateText));
}

export function formatLongDate(dateText: string) {
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// True when the appointment's date and time have already arrived.
export function appointmentHasStarted(dateText: string, slotTime: string) {
  const [year, month, day] = dateText.split("-").map(Number);
  const [hours, minutes] = slotTime.split(":").map(Number);
  const when = new Date(year, month - 1, day, hours, minutes);
  return when.getTime() <= Date.now();
}

// Builds a "2026-09-01" text. The month is 0 based here, like JavaScript dates.
export function toDateText(year: number, monthIndex: number, day: number) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

// Today as a "2026-09-01" text.
export function todayDateText() {
  const today = new Date();
  return toDateText(today.getFullYear(), today.getMonth(), today.getDate());
}

// The first upcoming date, within 60 days, that falls on one of the given weekdays.
export function firstWorkingDate(availableDays: string[]) {
  const today = new Date();

  for (let i = 0; i < 60; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const dateText = toDateText(date.getFullYear(), date.getMonth(), date.getDate());
    if (availableDays.includes(weekdayName(dateText))) return dateText;
  }

  return "";
}
