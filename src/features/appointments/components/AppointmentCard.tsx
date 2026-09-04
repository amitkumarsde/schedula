import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { formatSlotLabel, appointmentHasStarted, countdownLabel } from "@/lib/utils/schedule";
import AppointmentStatusBadge from "@/features/appointments/components/AppointmentStatusBadge";
import PendingActionBadge from "@/features/appointments/components/PendingActionBadge";
import type { Appointment, UserRole } from "@/types";

// One appointment row that links to its detail page.
export default function AppointmentCard({
  appointment,
  viewerRole,
  showStatus = false,
}: {
  appointment: Appointment;
  viewerRole: UserRole;
  showStatus?: boolean;
}) {
  const isPatient = viewerRole === "patient";
  const title = isPatient ? appointment.doctor.name : appointment.patient.name;
  const subtitle = isPatient ? appointment.doctor.specialization : `${appointment.patient.gender}, ${appointment.patient.age}`;
  // An upcoming visit whose slot time has passed still needs the doctor to act.
  const needsAction =
    appointment.status === "upcoming" && appointmentHasStarted(appointment.appointmentDate, appointment.slotTime);
  // A countdown like "Tomorrow" is shown only for an upcoming visit that has not started.
  const countdown =
    appointment.status === "upcoming" && !needsAction ? countdownLabel(appointment.appointmentDate) : "";

  return (
    <Link
      href={`/appointments/${appointment._id}`}
      className="flex items-center gap-3 rounded-xl px-3 py-4 transition-colors hover:bg-surface"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-ink">{title}</h3>
          <span className="shrink-0 text-sm font-medium text-muted">#{appointment.appointmentNumber}</span>
        </div>
        <div className="flex gap-2">
        {subtitle && <p className="truncate text-sm capitalize text-muted">{subtitle}</p>}
        {countdown && <p className="mt-0.5 text-xs font-semibold text-brand">{countdown}</p>}
        </div>
      </div>

      {needsAction ? (
        <PendingActionBadge viewerRole={viewerRole} />
      ) : (
        showStatus && <AppointmentStatusBadge status={appointment.status} />
      )}

      <span className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-ink sm:flex">
        <Clock className="h-4 w-4 text-brand" />
        {formatSlotLabel(appointment.slotTime)}
      </span>

      <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
    </Link>
  );
}
