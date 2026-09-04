"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMyAppointments } from "@/features/appointments/hooks/useMyAppointments";
import AppointmentCard from "@/features/appointments/components/AppointmentCard";
import { groupByDate } from "@/lib/utils/groupByDate";
import { formatLongDate } from "@/lib/utils/schedule";
import type { Appointment } from "@/types";

// True for a completed visit that has a real prescription (a diagnosis or medicines).
function hasPrescription(appointment: Appointment) {
  return (
    appointment.status === "completed" &&
    Boolean(appointment.diagnosis.trim() || appointment.medicines.length)
  );
}

// Completed visits with a prescription. The doctor manages them; the patient reads them.
export default function PrescriptionList() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { appointments, isLoading, errorMessage } = useMyAppointments(user?._id ?? "");

  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/login");
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || !user) return null;

  const withPrescription = appointments.filter(hasPrescription);
  const groups = groupByDate(withPrescription, (appointment) => appointment.appointmentDate, true);
  const isDoctor = user.role === "doctor";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Prescriptions</h1>
      <p className="mt-1.5 text-sm text-muted">
        {isDoctor
          ? "Completed visits where you added a diagnosis or medicines. Tap one to manage it."
          : "Completed visits with a diagnosis or medicines. Tap one to read it."}
      </p>

      <div className="mt-6">
        {isLoading && <div className="h-24 animate-pulse rounded-2xl bg-surface" />}

        {!isLoading && errorMessage && <Alert message={errorMessage} />}

        {!isLoading && !errorMessage && withPrescription.length === 0 && (
          <div className="rounded-2xl bg-surface p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-semibold text-ink">No prescriptions yet</p>
          </div>
        )}

        {!isLoading && withPrescription.length > 0 && (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.date}>
                <h2 className="mb-1 text-sm font-semibold text-muted">{formatLongDate(group.date)}</h2>
                <div className="divide-y divide-line">
                  {group.items.map((appointment) => (
                    <AppointmentCard key={appointment._id} appointment={appointment} viewerRole={user.role} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
