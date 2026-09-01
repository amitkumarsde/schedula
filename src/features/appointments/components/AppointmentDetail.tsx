"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useAppointment } from "@/features/appointments/hooks/useAppointment";
import { updateAppointmentStatus } from "@/features/appointments/api/appointmentService";
import DoctorSummaryCard from "@/features/appointments/components/DoctorSummaryCard";
import AppointmentStatusBadge from "@/features/appointments/components/AppointmentStatusBadge";
import { formatLongDate, formatSlotLabel } from "@/lib/utils/schedule";
import type { AppointmentStatus } from "@/types";

// Shows one label with its value.
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink">{value || "Not added"}</p>
    </div>
  );
}

// The full appointment page for the patient and the doctor.
export default function AppointmentDetail({ appointmentId }: { appointmentId: string }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { appointment, isLoading, errorMessage, reloadAppointment } = useAppointment(
    appointmentId,
    user?._id ?? ""
  );

  const [actionError, setActionError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/login");
  }, [isAuthLoading, user, router]);

  // Changes the status, for example cancel or complete, then reloads the page.
  async function changeStatus(status: AppointmentStatus) {
    if (!user) return;

    setActionError("");
    setIsUpdating(true);

    try {
      await updateAppointmentStatus(appointmentId, user._id, status);
      reloadAppointment();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not update the appointment");
    } finally {
      setIsUpdating(false);
    }
  }

  if (isAuthLoading || isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-64 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  if (errorMessage || !appointment || !user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Alert message={errorMessage || "Appointment not found"} />
      </div>
    );
  }

  const isDoctor = user.role === "doctor";
  const canChange = appointment.status === "upcoming";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/appointments"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to appointments
      </Link>

      <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          Appointment #{appointment.appointmentNumber}
        </h1>
        <AppointmentStatusBadge status={appointment.status} />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DoctorSummaryCard
            name={appointment.doctorName}
            specialization={appointment.doctorSpecialization}
            imageUrl=""
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-10">
            <span className="flex items-center gap-2 text-sm text-ink">
              <CalendarDays className="h-4 w-4 text-brand" />
              {formatLongDate(appointment.appointmentDate)}
            </span>
            <span className="flex items-center gap-2 text-sm text-ink">
              <Clock className="h-4 w-4 text-brand" />
              {formatSlotLabel(appointment.slotTime)}
            </span>
          </div>

          <section className="space-y-4 border-t border-line pt-6">
            <h2 className="font-bold text-ink">Patient details</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <DetailRow label="Full name" value={appointment.patientName} />
              <DetailRow label="Visit type" value={appointment.visitType} />
              <DetailRow label="Meet type" value={appointment.meetType} />
            </div>
            <DetailRow label="Problem" value={appointment.problem} />
          </section>
        </div>

        {/* The fee and the actions. */}
        <aside className="h-fit rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted">Consultation fee</span>
            <span className="text-sm font-medium text-ink">Rs {appointment.consultationFee}</span>
          </div>

          {canChange && (
            <div className="mt-5 space-y-3">
              {actionError && <Alert message={actionError} />}

              {/* Only the doctor can mark the visit as completed. */}
              {isDoctor && (
                <Button onClick={() => changeStatus("completed")} disabled={isUpdating} fullWidth>
                  Mark completed
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => changeStatus("cancelled")}
                disabled={isUpdating}
                fullWidth
              >
                Cancel appointment
              </Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
