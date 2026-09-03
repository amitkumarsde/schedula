"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, HeartPulse, FileText, ClipboardList, ShieldPlus, ExternalLink } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Chip from "@/components/ui/Chip";
import { useAuth } from "@/lib/auth/AuthContext";
import { usePatientProfile } from "@/features/profile/hooks/usePatientProfile";
import ProfileHeaderCard from "@/features/profile/components/ProfileHeaderCard";
import ProfileTabs, { type ProfileTab } from "@/features/profile/components/ProfileTabs";
import ProfileField from "@/features/profile/components/ProfileField";
import EditableSection from "@/features/profile/components/EditableSection";
import PatientBasicInfo from "@/features/profile/components/patient/PatientBasicInfo";
import PatientMedicalHistory from "@/features/profile/components/patient/PatientMedicalHistory";
import FileLinksSection from "@/features/profile/components/patient/FileLinksSection";
import PatientEmergency from "@/features/profile/components/patient/PatientEmergency";
import { getGenderLabel } from "@/lib/utils/profileOptions";
import type { FileLink } from "@/types";

const PATIENT_TABS: ProfileTab[] = [
  { key: "basic", label: "Basic Info", Icon: User },
  { key: "medical", label: "Medical History", Icon: HeartPulse },
  { key: "documents", label: "Documents", Icon: FileText },
  { key: "reports", label: "Test Reports", Icon: ClipboardList },
  { key: "emergency", label: "Emergency & Insurance", Icon: ShieldPlus },
];

// Shows a list of items as chips, or "None" when the list is empty.
function ChipList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>

      {items.length === 0 ? (
        <p className="mt-1 text-sm font-medium text-ink">None</p>
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

// The read-only list of saved file links.
function FileLinkList({ links, emptyText }: { links: FileLink[]; emptyText: string }) {
  if (links.length === 0) return <p className="text-sm text-muted">{emptyText}</p>;

  return (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li
          key={index}
          className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3"
        >
          <span className="truncate text-sm font-medium text-ink">{link.name}</span>

          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            Open
            <ExternalLink className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}

// The patient's own profile page.
export default function PatientProfile() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { patientProfile, isLoading, errorMessage, reloadProfile } = usePatientProfile(user?._id ?? "");
  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);

  // A doctor who lands here is sent to their own profile page.
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) router.push("/login");
    else if (user.role !== "patient") router.push("/profile/doctor");
  }, [isAuthLoading, user, router]);

  // Switching tab always goes back to the read view.
  function selectTab(key: string) {
    setActiveTab(key);
    setIsEditing(false);
  }

  // After a save, close the form and reload the fresh data.
  function finishEdit() {
    setIsEditing(false);
    reloadProfile();
  }

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

  const patient = patientProfile;

  // Shared props for the Edit/Cancel toggle on each section.
  const sectionProps = {
    isEditing,
    onEdit: () => setIsEditing(true),
    onCancel: () => setIsEditing(false),
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <ProfileHeaderCard
        fullName={patient.fullName || user.fullName}
        subtitle="Patient"
        email={user.email}
        imageUrl={patient.profileImage}
      />

      <div className="mt-6">
        <ProfileTabs tabs={PATIENT_TABS} activeKey={activeTab} onSelect={selectTab} />
      </div>

      <div className="mt-6">
        {activeTab === "basic" && (
          <EditableSection title="Basic info" {...sectionProps}>
            {isEditing ? (
              <PatientBasicInfo patient={patient} userId={user._id} onSaved={finishEdit} />
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                <ProfileField label="Full name" value={patient.fullName} />
                <ProfileField label="Age" value={patient.age ? `${patient.age} years` : ""} />
                <ProfileField label="Gender" value={patient.gender ? getGenderLabel(patient.gender) : ""} />
                <ProfileField label="Weight" value={patient.weight ? `${patient.weight} Kg` : ""} />
                <ProfileField label="Height" value={patient.height ? `${patient.height} cm` : ""} />
                <ProfileField label="Blood group" value={patient.bloodGroup} />
                <ProfileField label="Mobile number" value={patient.mobileNumber} />
                <ProfileField label="City" value={patient.city} />
              </div>
            )}
          </EditableSection>
        )}

        {activeTab === "medical" && (
          <EditableSection title="Medical history" {...sectionProps}>
            {isEditing ? (
              <PatientMedicalHistory patient={patient} userId={user._id} onSaved={finishEdit} />
            ) : (
              <div className="space-y-5">
                <ChipList label="Allergies" items={patient.allergies} />
                <ChipList label="Diseases" items={patient.diseases} />
                <ChipList label="Current medications" items={patient.currentMedications} />
              </div>
            )}
          </EditableSection>
        )}

        {activeTab === "documents" && (
          <EditableSection title="Documents" {...sectionProps}>
            {isEditing ? (
              <FileLinksSection links={patient.documents} userId={user._id} section="documents" onSaved={finishEdit} />
            ) : (
              <FileLinkList links={patient.documents} emptyText="No documents added yet." />
            )}
          </EditableSection>
        )}

        {activeTab === "reports" && (
          <EditableSection title="Test Reports" {...sectionProps}>
            {isEditing ? (
              <FileLinksSection links={patient.testReports} userId={user._id} section="reports" onSaved={finishEdit} />
            ) : (
              <FileLinkList links={patient.testReports} emptyText="No test reports added yet." />
            )}
          </EditableSection>
        )}

        {activeTab === "emergency" && (
          <EditableSection title="Emergency & Insurance" {...sectionProps}>
            {isEditing ? (
              <PatientEmergency patient={patient} userId={user._id} onSaved={finishEdit} />
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                <ProfileField label="Contact name" value={patient.emergencyName} />
                <ProfileField label="Contact phone" value={patient.emergencyPhone} />
                <ProfileField label="Relation" value={patient.emergencyRelation} />
                <ProfileField label="Insurance provider" value={patient.insuranceProvider} />
                <ProfileField label="Policy number" value={patient.insurancePolicyNumber} />
              </div>
            )}
          </EditableSection>
        )}
      </div>
    </div>
  );
}
