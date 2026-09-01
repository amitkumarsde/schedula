"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/lib/auth/AuthContext";
import { useDoctorProfile } from "@/features/profile/hooks/useDoctorProfile";
import DoctorBasicInfo from "@/features/profile/components/doctor/DoctorBasicInfo";
import DoctorProfessional from "@/features/profile/components/doctor/DoctorProfessional";
import DoctorAvailability from "@/features/profile/components/doctor/DoctorAvailability";

// The doctor edit page: every section is a form with its own Save button.
export default function DoctorProfileEdit() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { doctorProfile, isLoading, errorMessage } = useDoctorProfile(user?._id ?? "");

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) router.push("/login");
    else if (user.role !== "doctor") router.push("/profile/patient");
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="h-64 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  if (errorMessage || !user || !doctorProfile) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <Alert message={errorMessage || "Your profile was not found."} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href="/profile/doctor"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </Link>

      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Edit profile</h1>
      <p className="mt-1.5 text-sm text-muted">Each section saves on its own.</p>

      <div className="mt-6 divide-y divide-line">
        <div className="pb-8">
          <DoctorBasicInfo doctor={doctorProfile} userId={user._id} />
        </div>
        <div className="py-8">
          <DoctorProfessional doctor={doctorProfile} userId={user._id} />
        </div>
        <div className="py-8">
          <DoctorAvailability doctor={doctorProfile} userId={user._id} />
        </div>
      </div>
    </div>
  );
}
