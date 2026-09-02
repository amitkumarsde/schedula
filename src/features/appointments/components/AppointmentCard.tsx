import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { formatSlotLabel } from "@/lib/utils/schedule";
import type { Appointment, UserRole } from "@/types";

// One appointment row that links to its detail page.
export default function AppointmentCard({
  appointment,
  viewerRole,
}: {
  appointment: Appointment;
  viewerRole: UserRole;
}) {
  const isPatient = viewerRole === "patient";
  const title = isPatient ? appointment.doctor.name : appointment.patient.name;
  const subtitle = isPatient
    ? appointment.doctor.specialization
    : `${appointment.patient.gender}, ${appointment.patient.age}`;

  return (
    <Link
      href={`/appointments/${appointment._id}`}
      className="flex items-center gap-3 rounded-xl px-3 py-4 transition-colors hover:bg-surface"
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-ink">{title}</h3>
        {subtitle && <p className="truncate text-sm capitalize text-muted">{subtitle}</p>}
      </div>

      <span className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-ink sm:flex">
        <Clock className="h-4 w-4 text-brand" />
        {formatSlotLabel(appointment.slotTime)}
      </span>

      <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
    </Link>
  );
}
