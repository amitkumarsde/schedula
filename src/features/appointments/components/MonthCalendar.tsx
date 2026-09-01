"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { weekdayName, toDateText, todayDateText } from "@/lib/utils/schedule";

const WEEKDAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

type MonthCalendarProps = {
  year: number;
  month: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  availableDays?: string[];
  countsByDate?: Record<string, number>;
  disablePast?: boolean;
  onChangeMonth?: (year: number, month: number) => void;
};

// A month grid used by the booking page and the doctor dashboard.
export default function MonthCalendar({
  year,
  month,
  selectedDate,
  onSelectDate,
  availableDays,
  countsByDate,
  disablePast = false,
  onChangeMonth,
}: MonthCalendarProps) {
  const todayText = todayDateText();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // The arrows only show when the parent wants to change the month from here.
  const isThisMonth = todayText.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`);

  function changeMonth(step: number) {
    const moved = new Date(year, month + step, 1);
    onChangeMonth?.(moved.getFullYear(), moved.getMonth());
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      {onChangeMonth ? (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            disabled={disablePast && isThisMonth}
            aria-label="Previous month"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
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
      ) : (
        <p className="text-center text-sm font-semibold text-ink">{monthLabel}</p>
      )}

      <div className="mt-3 grid grid-cols-7 gap-1">
        {WEEKDAY_HEADERS.map((heading, index) => (
          <span key={index} className="py-1 text-center text-xs font-medium text-muted">
            {heading}
          </span>
        ))}

        {cells.map((day, index) => {
          if (day === null) return <span key={`empty-${index}`} />;

          const dateText = toDateText(year, month, day);
          const count = countsByDate?.[dateText] ?? 0;
          const isSelected = dateText === selectedDate;
          const isPast = disablePast && dateText < todayText;
          const isClosedDay = availableDays ? !availableDays.includes(weekdayName(dateText)) : false;
          const isDisabled = isPast || isClosedDay;

          return (
            <button
              key={dateText}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateText)}
              className={`flex h-11 flex-col items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-brand text-on-brand"
                  : isDisabled
                    ? "cursor-not-allowed text-muted opacity-40"
                    : "cursor-pointer text-ink hover:bg-brand-soft hover:text-brand"
              }`}
            >
              {day}

              {count > 0 && (
                <span
                  className={`mt-0.5 rounded-full px-1.5 text-[10px] font-semibold ${
                    isSelected ? "bg-on-brand/25 text-on-brand" : "bg-brand-soft text-brand"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
