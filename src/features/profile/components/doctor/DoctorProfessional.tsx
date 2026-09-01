"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import FormTextarea from "@/components/ui/FormTextarea";
import Alert from "@/components/ui/Alert";
import SaveButton from "@/features/profile/components/SaveButton";
import { useSaveForm } from "@/features/profile/hooks/useSaveForm";
import { saveDoctorProfileSection } from "@/features/profile/api/doctorProfileService";
import { SPECIALIZATIONS } from "@/lib/utils/specializations";
import type { Doctor } from "@/types";

type DoctorProfessionalProps = { doctor: Doctor; userId: string };

// The doctor professional details form.
export default function DoctorProfessional({ doctor, userId }: DoctorProfessionalProps) {
  const form = useSaveForm();

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
    form.runSave(async () => {
      await saveDoctorProfileSection(userId, "professional", {
        ...values,
        experienceYears: Number(values.experienceYears),
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-ink">Professional details</h3>

      {form.errorMessage && <Alert message={form.errorMessage} />}

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

      <SaveButton isSaving={form.isSaving} savedOk={form.savedOk} />
    </form>
  );
}
