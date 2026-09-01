"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, HeartPulse, FileText, ClipboardList, Plus, ExternalLink } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Chip from "@/components/ui/Chip";
import { useAuth } from "@/lib/auth/AuthContext";
import { usePatientProfile } from "@/features/profile/hooks/usePatientProfile";
import ProfileHeaderCard from "@/features/profile/components/ProfileHeaderCard";
import ProfileTabs, { type ProfileTab } from "@/features/profile/components/ProfileTabs";
import ProfileSection from "@/features/profile/components/ProfileSection";
import ProfileField from "@/features/profile/components/ProfileField";
import { getGenderLabel } from "@/lib/utils/profileOptions";
import type { FileLink } from "@/types";

const PATIENT_TABS: ProfileTab[] = [
  { key: "basic", label: "Basic Info", Icon: User },
  { key: "medical", label: "Medical History", Icon: HeartPulse },
  { key: "documents", label: "Documents", Icon: FileText },
  { key: "reports", label: "Test Reports", Icon: ClipboardList },
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

// One Documents or Test Reports tab, with an "Add" icon that opens the edit page.
function FileLinksTab({
  title,
  links,
  emptyText,
}: {
  title: string;
  links: FileLink[];
  emptyText: string;
}) {
  return (
    <section className="rounded-2xl border border-line bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink">{title}</h3>

        <Link
          href="/profile/patient/edit"
          aria-label={`Add ${title.toLowerCase()}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-brand hover:text-brand"
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5">
        {links.length === 0 ? (
          <p className="text-sm text-muted">{emptyText}</p>
        ) : (
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
        )}
      </div>
    </section>
  );
}

// The patient's own profile page (read-only tabs, edit icon opens the edit page).
export default function PatientProfile() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { patientProfile, isLoading, errorMessage } = usePatientProfile(user?._id ?? "");
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

  const patient = patientProfile;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <ProfileHeaderCard
        fullName={patient.fullName || user.fullName}
        subtitle="Patient"
        email={user.email}
        imageUrl={patient.profileImage}
        editHref="/profile/patient/edit"
      />

      <div className="mt-6">
        <ProfileTabs tabs={PATIENT_TABS} activeKey={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="mt-6">
        {activeTab === "basic" && (
          <ProfileSection title="Basic info">
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
          </ProfileSection>
        )}

        {activeTab === "medical" && (
          <ProfileSection title="Medical history">
            <div className="space-y-5">
              <ChipList label="Allergies" items={patient.allergies} />
              <ChipList label="Diseases" items={patient.diseases} />
            </div>
          </ProfileSection>
        )}

        {activeTab === "documents" && (
          <FileLinksTab title="Documents" links={patient.documents} emptyText="No documents added yet." />
        )}

        {activeTab === "reports" && (
          <FileLinksTab title="Test Reports" links={patient.testReports} emptyText="No test reports added yet." />
        )}
      </div>
    </div>
  );
}
