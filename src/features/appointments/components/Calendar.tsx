"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { weekdayName } from "@/lib/utils/schedule";

const WEEKDAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

// Adds a leading zero to a small number.
function pad(value: number) {
  return String(value).padStart(2, "0");
}

// Builds a "2026-09-01" string. The month is 0 based here, like JavaScript dates.
function toDateText(year: number, monthIndex: number, day: number) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

// A month calendar to pick a date.
export default function Calendar({
  selectedDate,
  onSelect,
  availableDays,
}: {
  selectedDate: string;
  onSelect: (date: string) => void;
  availableDays: string[];
}) {
  const today = new Date();
  const todayText = toDateText(today.getFullYear(), today.getMonth(), today.getDate());

  const [view, setView] = useState(() => {
    const startFrom = selectedDate || todayText;
    const [year, month] = startFrom.split("-").map(Number);
    return { year, month: month - 1 };
  });

  const firstWeekday = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // We do not let the patient go back into past months.
  const isThisMonth = view.year === today.getFullYear() && view.month === today.getMonth();

  // Moves the calendar to another month.
  function changeMonth(step: number) {
    const moved = new Date(view.year, view.month + step, 1);
    setView({ year: moved.getFullYear(), month: moved.getMonth() });
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={isThisMonth}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <span className="text-sm font-semibold text-ink">{monthLabel}</span>

        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Next month"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:text-brand"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1">
        {WEEKDAY_HEADERS.map((heading, index) => (
          <span key={index} className="py-1 text-center text-xs font-medium text-muted">
            {heading}
          </span>
        ))}

        {cells.map((day, index) => {
          if (day === null) return <span key={`empty-${index}`} />;

          const dateText = toDateText(view.year, view.month, day);
          const isPast = dateText < todayText;
          const isWorkingDay = availableDays.includes(weekdayName(dateText));
          const isDisabled = isPast || !isWorkingDay;
          const isSelected = dateText === selectedDate;

          return (
            <button
              key={dateText}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(dateText)}
              className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-brand text-on-brand"
                  : isDisabled
                    ? "cursor-not-allowed text-muted opacity-40"
                    : "cursor-pointer text-ink hover:bg-brand-soft hover:text-brand"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
