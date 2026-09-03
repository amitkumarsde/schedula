"use client";

import { useRef } from "react";
import { Move, X } from "lucide-react";
import { formatSlotLabel, formatLongDate, appointmentHasStarted } from "@/lib/utils/schedule";
import type { Appointment, UserRole } from "@/types";

// The calendar shows only upcoming and completed appointments.
type ShownStatus = "upcoming" | "completed";

// Soft colours so each status is easy to tell apart at a glance.
const STATUS_STYLE: Record<ShownStatus, string> = {
  upcoming: "border-brand bg-brand-soft text-ink",
  completed: "border-success bg-success-soft text-ink",
};

type DayCalendarProps = {
  selectedDate: string;
  times: string[];
  appointmentsByTime: Record<string, Appointment[]>;
  viewerRole: UserRole;
  pickedUpId: string | null;
  onOpenDetail: (appointmentId: string) => void;
  onPickUp: (appointmentId: string) => void;
  onDragStart: (appointmentId: string) => void;
  onDropOnTime: (time: string) => void;
  onClickTime: (time: string) => void;
  canReschedule?: boolean;
  emptyText?: string;
};

// The day view: every time slot for the selected day, in a grid.
export default function DayCalendar({
  selectedDate,
  times,
  appointmentsByTime,
  viewerRole,
  pickedUpId,
  onOpenDetail,
  onPickUp,
  onDragStart,
  onDropOnTime,
  onClickTime,
  canReschedule = true,
  emptyText = "You do not consult on this day.",
}: DayCalendarProps) {
  const wasDragged = useRef(false);

  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <p className="text-sm font-semibold text-ink">{formatLongDate(selectedDate)}</p>

      {pickedUpId && (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-brand-soft px-3 py-2">
          <p className="text-xs font-medium text-brand">
            Moving an appointment. Pick any month, day, then tap a free slot.
          </p>
          <button
            type="button"
            onClick={() => onPickUp(pickedUpId)}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand hover:underline"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        </div>
      )}

      {times.length === 0 && <p className="mt-3 text-sm text-muted">{emptyText}</p>}

      <div className="thin-scrollbar mt-3 grid max-h-[30rem] grid-cols-3 gap-2 overflow-y-auto pr-1">
        {times.map((time) => {
          // Only upcoming and completed appointments hold a slot here.
          const appointment = (appointmentsByTime[time] ?? []).find(
            (one): one is Appointment & { status: ShownStatus } =>
              one.status === "upcoming" || one.status === "completed"
          );

          // A free slot is a drop target.
          if (!appointment) {
            const isPast = appointmentHasStarted(selectedDate, time);
            const canDrop = Boolean(pickedUpId) && !isPast;

            return (
              <div
                key={time}
                onDragOver={(event) => !isPast && event.preventDefault()}
                onDrop={() => !isPast && onDropOnTime(time)}
                onClick={() => canDrop && onClickTime(time)}
                className={`rounded-xl border border-dashed p-2 transition-colors ${
                  isPast
                    ? "border-line opacity-40"
                    : pickedUpId
                      ? "cursor-pointer border-brand bg-brand-soft/40"
                      : "border-line"
                }`}
              >
                <p className="text-xs font-medium text-muted">{formatSlotLabel(time)}</p>
                <p className="mt-2 text-xs text-muted/70">
                  {isPast ? "Past" : pickedUpId ? "Drop here" : "Free"}
                </p>
              </div>
            );
          }

          // A booked slot: the whole box is coloured by its status.
          const isUpcoming = appointment.status === "upcoming";
          const title = viewerRole === "patient" ? appointment.doctor.name : appointment.patient.name;
          const isPicked = pickedUpId === appointment._id;

          return (
            <div
              key={time}
              draggable={isUpcoming && canReschedule}
              onDragStart={() => {
                wasDragged.current = true;
                onDragStart(appointment._id);
              }}
              onDragEnd={() => {
                wasDragged.current = false;
              }}
              onClick={() => {
                if (wasDragged.current) {
                  wasDragged.current = false;
                  return;
                }
                onOpenDetail(appointment._id);
              }}
              className={`cursor-pointer rounded-xl border p-2 transition-colors ${STATUS_STYLE[appointment.status]} ${
                isPicked ? "ring-2 ring-brand" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-medium opacity-80">{formatSlotLabel(time)}</span>

                {isUpcoming && canReschedule && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onPickUp(appointment._id);
                    }}
                    aria-label="Move appointment"
                    className="shrink-0 cursor-pointer opacity-80 hover:opacity-100"
                  >
                    <Move className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <p className="mt-1 truncate text-sm font-medium">{title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
