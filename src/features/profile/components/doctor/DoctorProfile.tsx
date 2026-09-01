"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Stethoscope, CalendarClock } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/lib/auth/AuthContext";
import { useDoctorProfile } from "@/features/profile/hooks/useDoctorProfile";
import ProfileHeaderCard from "@/features/profile/components/ProfileHeaderCard";
import ProfileTabs, { type ProfileTab } from "@/features/profile/components/ProfileTabs";
import ProfileSection from "@/features/profile/components/ProfileSection";
import ProfileField from "@/features/profile/components/ProfileField";
import DoctorStatsRow from "@/features/profile/components/doctor/DoctorStatsRow";
import { getGenderLabel } from "@/lib/utils/profileOptions";

const DOCTOR_TABS: ProfileTab[] = [
  { key: "basic", label: "Basic Info", Icon: User },
  { key: "professional", label: "Professional", Icon: Stethoscope },
  { key: "availability", label: "Availability", Icon: CalendarClock },
];

// The doctor's own profile page (read-only tabs, edit icon opens the edit page).
export default function DoctorProfile() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { doctorProfile, isLoading, errorMessage } = useDoctorProfile(user?._id ?? "");
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

  const doctor = doctorProfile;
  const timeRange = doctor.startTime && doctor.endTime ? `${doctor.startTime} - ${doctor.endTime}` : "";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <ProfileHeaderCard
        fullName={doctor.fullName || user.fullName}
        subtitle={doctor.specialization || "Doctor"}
        email={user.email}
        imageUrl={doctor.profileImage}
        editHref="/profile/doctor/edit"
      />

      <div className="mt-4">
        <DoctorStatsRow doctor={doctor} />
      </div>

      <div className="mt-6">
        <ProfileTabs tabs={DOCTOR_TABS} activeKey={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="mt-6">
        {activeTab === "basic" && (
          <ProfileSection title="Basic info">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              <ProfileField label="Full name" value={doctor.fullName} />
              <ProfileField label="Gender" value={doctor.gender ? getGenderLabel(doctor.gender) : ""} />
              <ProfileField label="Mobile number" value={doctor.mobileNumber} />
              <ProfileField label="City" value={doctor.city} />
            </div>
          </ProfileSection>
        )}

        {activeTab === "professional" && (
          <ProfileSection title="Professional">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              <ProfileField label="Specialization" value={doctor.specialization} />
              <ProfileField label="Qualification" value={doctor.qualification} />
              <ProfileField
                label="Experience"
                value={doctor.experienceYears ? `${doctor.experienceYears} years` : ""}
              />
              <ProfileField label="Hospital" value={doctor.hospitalName} />
            </div>

            <div className="mt-5 border-t border-line pt-5">
              <p className="text-sm text-muted">About you</p>
              <p className="mt-1 text-sm leading-relaxed text-ink">{doctor.about || "N/A"}</p>
            </div>
          </ProfileSection>
        )}

        {activeTab === "availability" && (
          <ProfileSection title="Availability">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              <ProfileField label="Consulting days" value={doctor.availableDays.join(", ")} />
              <ProfileField label="Consulting time" value={timeRange} />
              <ProfileField label="Slot length" value={`${doctor.slotDuration} min`} />
              <ProfileField
                label="Break between slots"
                value={doctor.breakDuration ? `${doctor.breakDuration} min` : "No break"}
              />

              <ProfileField
                label="Consultation fee"
                value={doctor.consultationFee ? `Rs ${doctor.consultationFee}` : ""}
              />
              <ProfileField label="Visit type" value={doctor.visitTypes.join(", ")} />
              <ProfileField label="Meet type" value={doctor.meetTypes.join(", ")} />
              <ProfileField label="Consult type" value={doctor.consultTypes.join(", ")} />
              <ProfileField label="Listed for booking" value={doctor.isAvailable ? "Yes" : "No"} />
            </div>
          </ProfileSection>
        )}
      </div>
    </div>
  );
}
