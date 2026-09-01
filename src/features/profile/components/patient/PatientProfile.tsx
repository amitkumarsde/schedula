"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, HeartPulse, FileText, ClipboardList } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/lib/auth/AuthContext";
import { usePatientProfile } from "@/features/profile/hooks/usePatientProfile";
import ProfileHeaderCard from "@/features/profile/components/ProfileHeaderCard";
import ProfileTabs, { type ProfileTab } from "@/features/profile/components/ProfileTabs";
import PatientBasicInfo from "@/features/profile/components/patient/PatientBasicInfo";
import PatientMedicalHistory from "@/features/profile/components/patient/PatientMedicalHistory";
import FileLinksSection from "@/features/profile/components/patient/FileLinksSection";

const PATIENT_TABS: ProfileTab[] = [
  { key: "basic", label: "Basic Info", Icon: User },
  { key: "medical", label: "Medical History", Icon: HeartPulse },
  { key: "documents", label: "Documents", Icon: FileText },
  { key: "reports", label: "Test Reports", Icon: ClipboardList },
];

// The patient's own profile page.
export default function PatientProfile() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { patientProfile, isLoading, errorMessage, reloadProfile } = usePatientProfile(
    user?._id ?? ""
  );
  const [activeTab, setActiveTab] = useState("basic");

  // A doctor who lands here is sent to their own profile page.
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) router.push("/login");
    else if (user.role !== "patient") router.push("/profile/doctor");
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

  if (!user || user.role !== "patient") return null;

  if (!patientProfile) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Alert message="Your profile was not found. Please sign up again." />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <ProfileHeaderCard
        fullName={patientProfile.fullName || user.fullName}
        subtitle="Patient"
        email={user.email}
        imageUrl={patientProfile.profileImage}
      />

      <div className="mt-6">
        <ProfileTabs tabs={PATIENT_TABS} activeKey={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="mt-6">
        {activeTab === "basic" && (
          <PatientBasicInfo patient={patientProfile} userId={user._id} onSaved={reloadProfile} />
        )}
        {activeTab === "medical" && (
          <PatientMedicalHistory patient={patientProfile} userId={user._id} onSaved={reloadProfile} />
        )}
        {activeTab === "documents" && (
          <FileLinksSection
            title="Documents"
            emptyText="No documents added yet."
            links={patientProfile.documents}
            userId={user._id}
            section="documents"
            onSaved={reloadProfile}
          />
        )}
        {activeTab === "reports" && (
          <FileLinksSection
            title="Test Reports"
            emptyText="No test reports added yet."
            links={patientProfile.testReports}
            userId={user._id}
            section="reports"
            onSaved={reloadProfile}
          />
        )}
      </div>
    </div>
  );
}
