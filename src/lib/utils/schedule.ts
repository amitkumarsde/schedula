// Helpers to build appointment time slots and to read dates. Used by the API and the pages.

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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

export function makeSlots(startTime: string, endTime: string, durationMinutes: number): string[] {
  if (!startTime || !endTime || !durationMinutes) return [];

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const slots: string[] = [];

  for (let time = start; time + durationMinutes <= end; time += durationMinutes) {
    slots.push(toTime(time));
  }

  return slots;
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

export function formatLongDate(dateText: string) {
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function nextDays(count: number) {
  const today = new Date();
  const days = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const dateText = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

    days.push({
      date: dateText,
      dayLabel: SHORT_DAYS[date.getDay()],
      dateLabel: String(date.getDate()),
    });
  }

  return days;
}
