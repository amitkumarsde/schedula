import type { AppointmentStatus } from "@/types";

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  upcoming: "bg-brand-soft text-brand",
  completed: "bg-success-soft text-success",
  missed: "bg-surface text-muted",
  cancelled: "bg-danger-soft text-danger",
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  upcoming: "Upcoming",
  completed: "Completed",
  missed: "Missed",
  cancelled: "Cancelled",
};

// A small coloured badge for the appointment status.
export default function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
