import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import AppointmentStatusBadge from "@/features/appointments/components/AppointmentStatusBadge";
import { formatLongDate, formatSlotLabel } from "@/lib/utils/schedule";
import type { Appointment, UserRole } from "@/types";

// One appointment row that links to its detail page.
export default function AppointmentCard({
  appointment,
  viewerRole,
}: {
  appointment: Appointment;
  viewerRole: UserRole;
}) {
  // A patient sees the doctor's details, a doctor sees the patient's details.
  const title = viewerRole === "patient" ? appointment.doctorName : appointment.patientName;
  const subtitle = viewerRole === "patient" ? appointment.doctorSpecialization : "Patient";

  return (
    <Link
      href={`/appointments/${appointment._id}`}
      className="block rounded-2xl border border-line bg-card p-4 transition-colors hover:border-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-bold text-ink">{title}</h3>
          {subtitle && <p className="text-sm text-brand">{subtitle}</p>}
        </div>

        <AppointmentStatusBadge status={appointment.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" />
          {formatLongDate(appointment.appointmentDate)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {formatSlotLabel(appointment.slotTime)}
        </span>
      </div>
    </Link>
  );
}
