"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { weekdayName, toDateText } from "@/lib/utils/schedule";

type AppCalendarProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  availableDays?: string[];
  countsByDate?: Record<string, number>;
  minDate?: Date;
  maxDate?: Date;
};

// Turns a Date into our "2026-09-01" text.
function dateToText(date: Date) {
  return toDateText(date.getFullYear(), date.getMonth(), date.getDate());
}

// A month calendar built on react-calendar, used by booking and the dashboard.
export default function AppCalendar({
  selectedDate,
  onSelectDate,
  availableDays,
  countsByDate,
  minDate,
  maxDate,
}: AppCalendarProps) {
  const [year, month, day] = selectedDate ? selectedDate.split("-").map(Number) : [];
  const value = selectedDate ? new Date(year, month - 1, day) : null;

  return (
    <Calendar
      value={value}
      onChange={(next) => next instanceof Date && onSelectDate(dateToText(next))}
      minDate={minDate}
      maxDate={maxDate}
      minDetail="month"
      maxDetail="month"
      prev2Label={null}
      next2Label={null}
      tileDisabled={({ date, view }) =>
        view === "month" && !!availableDays && !availableDays.includes(weekdayName(dateToText(date)))
      }
      tileContent={({ date, view }) => {
        if (view !== "month" || !countsByDate) return null;
        const count = countsByDate[dateToText(date)] ?? 0;
        return count > 0 ? <span className="calendar-count">{count}</span> : null;
      }}
    />
  );
}
