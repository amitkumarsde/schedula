import Link from "next/link";
import { CalendarDays, Clock, ChevronRight, Stethoscope } from "lucide-react";
import AppointmentStatusBadge from "@/features/appointments/components/AppointmentStatusBadge";
import { formatLongDate, formatSlotLabel } from "@/lib/utils/schedule";
import type { Appointment, UserRole } from "@/types";

// One appointment shown as a full-width row that links to its detail page.
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
      className="flex items-center gap-4 rounded-lg px-2 py-4 transition-colors hover:bg-surface"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft">
        <Stethoscope className="h-4 w-4 text-brand" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-bold text-ink">{title}</h3>
          <span className="text-xs text-muted">#{appointment.appointmentNumber}</span>
        </div>
        {subtitle && <p className="truncate text-sm text-brand">{subtitle}</p>}

        {/* On small screens the date and time sit below the name. */}
        <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted lg:hidden">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatLongDate(appointment.appointmentDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatSlotLabel(appointment.slotTime)}
          </span>
        </div>
      </div>

      {/* On large screens the date and time move to the right of the name. */}
      <div className="hidden shrink-0 items-center gap-5 text-sm text-muted lg:flex">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" />
          {formatLongDate(appointment.appointmentDate)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {formatSlotLabel(appointment.slotTime)}
        </span>
      </div>

      <div className="hidden shrink-0 sm:block">
        <AppointmentStatusBadge status={appointment.status} />
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
    </Link>
  );
}
