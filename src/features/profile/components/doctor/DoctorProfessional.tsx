"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import FormTextarea from "@/components/ui/FormTextarea";
import Alert from "@/components/ui/Alert";
import ProfileField from "@/features/profile/components/ProfileField";
import EditableCard from "@/features/profile/components/EditableCard";
import EditActions from "@/features/profile/components/EditActions";
import { useEditableSection } from "@/features/profile/hooks/useEditableSection";
import { saveDoctorProfileSection } from "@/features/profile/api/doctorProfileService";
import { SPECIALIZATIONS } from "@/lib/utils/specializations";
import type { Doctor } from "@/types";

type DoctorProfessionalProps = { doctor: Doctor; userId: string; onSaved: () => void };

// The doctor professional tab.
export default function DoctorProfessional({ doctor, userId, onSaved }: DoctorProfessionalProps) {
  const editor = useEditableSection(onSaved);

  const [values, setValues] = useState({
    specialization: doctor.specialization ?? "",
    qualification: doctor.qualification ?? "",
    experienceYears: doctor.experienceYears ? String(doctor.experienceYears) : "",
    hospitalName: doctor.hospitalName ?? "",
    about: doctor.about ?? "",
  });

  // Updates one field and keeps the others.
  function setField(name: keyof typeof values, value: string) {
    setValues({ ...values, [name]: value });
  }

  // Sends the form to the API when submitted.
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    editor.runSave(async () => {
      await saveDoctorProfileSection(userId, "professional", {
        ...values,
        experienceYears: Number(values.experienceYears),
      });
    });
  }

  if (!editor.isEditing) {
    return (
      <div className="space-y-4">
        <EditableCard title="Professional" onEdit={editor.openEditor}>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            <ProfileField label="Specialization" value={doctor.specialization} />
            <ProfileField label="Qualification" value={doctor.qualification} />
            <ProfileField
              label="Experience"
              value={doctor.experienceYears ? `${doctor.experienceYears} years` : ""}
            />
            <ProfileField label="Hospital" value={doctor.hospitalName} />
          </div>
        </EditableCard>

        <div className="rounded-2xl border border-line bg-card p-6">
          <h3 className="font-bold text-ink">About you</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{doctor.about || "Not added"}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-card p-6">
      <h3 className="font-bold text-ink">Edit professional details</h3>

      {editor.errorMessage && <Alert message={editor.errorMessage} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelect
          label="Specialization"
          name="specialization"
          value={values.specialization}
          onChange={(value) => setField("specialization", value)}
          options={SPECIALIZATIONS.map((name) => ({ value: name, label: name }))}
          placeholder="Select specialization"
          required
        />

        <FormInput
          label="Experience (years)"
          name="experienceYears"
          type="number"
          value={values.experienceYears}
          onChange={(value) => setField("experienceYears", value)}
          placeholder="Years of experience"
          required
        />
      </div>

      <FormInput
        label="Qualification"
        name="qualification"
        value={values.qualification}
        onChange={(value) => setField("qualification", value)}
        placeholder="MBBS, MD (Internal Medicine)"
        required
      />

      <FormInput
        label="Hospital name"
        name="hospitalName"
        value={values.hospitalName}
        onChange={(value) => setField("hospitalName", value)}
        placeholder="Where you practice"
      />

      <FormTextarea
        label="About you"
        name="about"
        value={values.about}
        onChange={(value) => setField("about", value)}
        placeholder="Write a few lines about your work and experience"
        hint="Patients read this on the doctors list."
      />

      <EditActions isSaving={editor.isSaving} onCancel={editor.closeEditor} />
    </form>
  );
}
