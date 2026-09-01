"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Building2, Award, Star, Users, MessageSquare } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import StatTiles from "@/components/ui/StatTiles";
import { useDoctor } from "@/features/doctors/hooks/useDoctor";
import { useAuth } from "@/lib/auth/AuthContext";

// Shows one label with its value.
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-b-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-ink">{value || "Not added"}</span>
    </div>
  );
}

// The public doctor profile page.
export default function DoctorProfileView({ doctorId }: { doctorId: string }) {
  const { doctor, isLoading, errorMessage } = useDoctor(doctorId);
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-64 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  if (errorMessage || !doctor) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Alert message={errorMessage || "Doctor not found"} />
      </div>
    );
  }

  const tiles = [
    { Icon: Users, value: `${doctor.totalPatients}+`, label: "Patients" },
    { Icon: Award, value: `${doctor.experienceYears} yrs`, label: "Experience" },
    { Icon: Star, value: doctor.rating, label: "Rating" },
    { Icon: MessageSquare, value: doctor.totalReviews, label: "Reviews" },
  ];

  const isPatient = user?.role === "patient";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/doctors"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to doctors
      </Link>

      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center">
        <Avatar imageUrl={doctor.profileImage} fullName={doctor.fullName} size={112} />

        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{doctor.fullName}</h1>
          <p className="mt-1 text-sm font-medium text-brand">{doctor.specialization}</p>
          <p className="mt-1 text-sm text-muted">{doctor.qualification}</p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            {doctor.hospitalName && (
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {doctor.hospitalName}
              </span>
            )}
            {doctor.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {doctor.city}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <StatTiles tiles={tiles} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="font-bold text-ink">About doctor</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{doctor.about || "Not added"}</p>
          </section>

          <section>
            <h2 className="font-bold text-ink">Details</h2>
            <div className="mt-2">
              <InfoRow label="Specialization" value={doctor.specialization} />
              <InfoRow label="Qualification" value={doctor.qualification} />
              <InfoRow label="Consulting days" value={doctor.availableDays.join(", ")} />
            </div>
          </section>
        </div>

        {/* The booking box. Only a patient sees the book button. */}
        <aside className="h-fit rounded-2xl border border-line bg-card p-6">
          <p className="text-sm text-muted">Consultation fee</p>
          <p className="mt-1 text-2xl font-bold text-ink">Rs {doctor.consultationFee}</p>

          <div className="mt-5">
            {isPatient ? (
              <Button href={`/doctors/${doctor._id}/book`} fullWidth>
                Book appointment
              </Button>
            ) : user ? (
              <p className="text-center text-sm text-muted">Only patients can book an appointment.</p>
            ) : (
              <Button href="/login" fullWidth>
                Login to book
              </Button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
