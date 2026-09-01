"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Stethoscope, CalendarClock } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/lib/auth/AuthContext";
import { useDoctorProfile } from "@/features/profile/hooks/useDoctorProfile";
import ProfileHeaderCard from "@/features/profile/components/ProfileHeaderCard";
import ProfileTabs, { type ProfileTab } from "@/features/profile/components/ProfileTabs";
import DoctorStatsRow from "@/features/profile/components/doctor/DoctorStatsRow";
import DoctorBasicInfo from "@/features/profile/components/doctor/DoctorBasicInfo";
import DoctorProfessional from "@/features/profile/components/doctor/DoctorProfessional";
import DoctorAvailability from "@/features/profile/components/doctor/DoctorAvailability";

const DOCTOR_TABS: ProfileTab[] = [
  { key: "basic", label: "Basic Info", Icon: User },
  { key: "professional", label: "Professional", Icon: Stethoscope },
  { key: "availability", label: "Availability", Icon: CalendarClock },
];

// The doctor's own profile page.
export default function DoctorProfile() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { doctorProfile, isLoading, errorMessage, reloadProfile } = useDoctorProfile(
    user?._id ?? ""
  );
  const [activeTab, setActiveTab] = useState("basic");

  // A patient who lands here is sent to their own profile page.
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) router.push("/login");
    else if (user.role !== "doctor") router.push("/profile/patient");
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="h-64 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Alert message={errorMessage} />
      </div>
    );
  }

  if (!user || user.role !== "doctor") return null;

  if (!doctorProfile) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Alert message="Your profile was not found. Please sign up again." />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <ProfileHeaderCard
        fullName={doctorProfile.fullName || user.fullName}
        subtitle={doctorProfile.specialization || "Doctor"}
        email={user.email}
        imageUrl={doctorProfile.profileImage}
      />

      <div className="mt-4">
        <DoctorStatsRow doctor={doctorProfile} />
      </div>

      <div className="mt-6">
        <ProfileTabs tabs={DOCTOR_TABS} activeKey={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="mt-6">
        {activeTab === "basic" && (
          <DoctorBasicInfo doctor={doctorProfile} userId={user._id} onSaved={reloadProfile} />
        )}
        {activeTab === "professional" && (
          <DoctorProfessional doctor={doctorProfile} userId={user._id} onSaved={reloadProfile} />
        )}
        {activeTab === "availability" && (
          <DoctorAvailability doctor={doctorProfile} userId={user._id} onSaved={reloadProfile} />
        )}
      </div>
    </div>
  );
}
