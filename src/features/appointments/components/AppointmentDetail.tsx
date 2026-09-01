"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarClock } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import { useAuth } from "@/lib/auth/AuthContext";
import { useAppointment } from "@/features/appointments/hooks/useAppointment";
import { updateAppointmentStatus } from "@/features/appointments/api/appointmentService";
import { getPatientProfile } from "@/features/profile/api/patientProfileService";
import AppointmentStatusBadge from "@/features/appointments/components/AppointmentStatusBadge";
import PrescriptionCard from "@/features/appointments/components/PrescriptionCard";
import DoctorPrescriptionForm from "@/features/appointments/components/DoctorPrescriptionForm";
import { formatLongDate, formatSlotLabel, appointmentHasStarted } from "@/lib/utils/schedule";
import { getGenderLabel } from "@/lib/utils/profileOptions";
import type { Patient } from "@/types";

// One section title, the same style everywhere on the page.
function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-lg font-bold text-ink">{children}</h2>;
}

// One label and its value, the same style everywhere on the page.
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink">{value || "N/A"}</p>
    </div>
  );
}

// A label with a row of chips, or "None" when the list is empty.
function ChipField({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      {items.length === 0 ? (
        <p className="mt-0.5 text-sm font-medium text-ink">None</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Chip key={index} label={item} />
          ))}
        </div>
      )}
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

  const [patient, setPatient] = useState<Patient | null>(null);
  const [actionError, setActionError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/login");
  }, [isAuthLoading, user, router]);

  // Load the patient's profile so we can show their medical details.
  useEffect(() => {
    if (!appointment) return;
    let isActive = true;
    getPatientProfile(appointment.patientUserId)
      .then((result) => {
        if (isActive) setPatient(result);
      })
      .catch(() => {});
    return () => {
      isActive = false;
    };
  }, [appointment]);

  // Cancels the appointment, then reloads the page.
  async function cancelAppointment() {
    if (!user) return;

    setActionError("");
    setIsUpdating(true);

    try {
      await updateAppointmentStatus(appointmentId, user._id, "cancelled");
      reloadAppointment();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not cancel the appointment");
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
  const isUpcoming = appointment.status === "upcoming";
  const hasStarted = appointmentHasStarted(appointment.appointmentDate, appointment.slotTime);
  const hasPrescription = Boolean(appointment.prescriptionDescription || appointment.medicines.length);
  const canPrescribe = isDoctor && isUpcoming && hasStarted;

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
        <div className="space-y-8 lg:col-span-2">
          <section>
            <SectionTitle>Doctor</SectionTitle>
            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Name" value={appointment.doctorName} />
              <Field label="Specialization" value={appointment.doctorSpecialization} />
            </div>
          </section>

          <section className="border-t border-line pt-6">
            <SectionTitle>Patient</SectionTitle>
            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Name" value={patient?.fullName || appointment.patientName} />
              <Field label="Contact number" value={patient?.mobileNumber ?? ""} />
              <Field label="Gender" value={patient?.gender ? getGenderLabel(patient.gender) : ""} />
              <Field label="Age" value={patient?.age ? `${patient.age} years` : ""} />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ChipField label="Allergies" items={patient?.allergies ?? []} />
              <ChipField label="Diseases" items={patient?.diseases ?? []} />
            </div>
          </section>

          <section className="border-t border-line pt-6">
            <SectionTitle>Appointment</SectionTitle>
            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Date" value={formatLongDate(appointment.appointmentDate)} />
              <Field label="Time" value={formatSlotLabel(appointment.slotTime)} />
              <Field label="Visit type" value={appointment.visitType} />
              <Field label="Meet type" value={appointment.meetType} />
              <Field label="Consult type" value={appointment.consultType} />
            </div>
            <div className="mt-5">
              <Field label="Problem" value={appointment.problem} />
            </div>
          </section>

          {/* Prescription: the doctor fills it after the visit time; others read it. */}
          {canPrescribe ? (
            <section className="border-t border-line pt-6">
              <DoctorPrescriptionForm
                appointmentId={appointment._id}
                userId={user._id}
                initialDescription={appointment.prescriptionDescription}
                initialMedicines={appointment.medicines}
                onUpdated={reloadAppointment}
              />
            </section>
          ) : (
            hasPrescription && (
              <section className="border-t border-line pt-6">
                <SectionTitle>Prescription</SectionTitle>
                <div className="mt-3">
                  <PrescriptionCard
                    description={appointment.prescriptionDescription}
                    medicines={appointment.medicines}
                  />
                </div>
              </section>
            )
          )}

          {isDoctor && isUpcoming && !hasStarted && (
            <p className="border-t border-line pt-6 text-sm text-muted">
              You can add the prescription after the appointment&apos;s scheduled time.
            </p>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-card p-6">
          <p className="text-sm text-muted">Consultation fee</p>
          <p className="mt-1 text-2xl font-bold text-ink">Rs {appointment.consultationFee}</p>

          {isUpcoming && (
            <div className="mt-5 space-y-3">
              {actionError && <Alert message={actionError} />}

              {isDoctor && (
                <Button href="/dashboard" variant="outline" fullWidth>
                  <CalendarClock className="h-4 w-4" />
                  Reschedule
                </Button>
              )}

              <Button variant="outline" onClick={cancelAppointment} disabled={isUpdating} fullWidth>
                Cancel appointment
              </Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
