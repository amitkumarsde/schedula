"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import Alert from "@/components/ui/Alert";
import SaveButton from "@/features/profile/components/SaveButton";
import { useSaveForm } from "@/features/profile/hooks/useSaveForm";
import { savePatientProfileSection } from "@/features/profile/api/patientProfileService";
import { useAuth } from "@/lib/auth/AuthContext";
import { BLOOD_GROUPS, PATIENT_GENDER_OPTIONS } from "@/lib/utils/profileOptions";
import type { Patient } from "@/types";

type PatientBasicInfoProps = { patient: Patient; userId: string; onSaved?: () => void };

// The patient basic info form.
export default function PatientBasicInfo({ patient, userId, onSaved }: PatientBasicInfoProps) {
  const { updateUser } = useAuth();
  const form = useSaveForm();

  // The form values, kept as text while the user is typing.
  const [values, setValues] = useState({
    fullName: patient.fullName ?? "",
    age: patient.age ? String(patient.age) : "",
    gender: patient.gender ?? "",
    mobileNumber: patient.mobileNumber ?? "",
    weight: patient.weight ? String(patient.weight) : "",
    height: patient.height ? String(patient.height) : "",
    bloodGroup: patient.bloodGroup ?? "",
    city: patient.city ?? "",
    profileImage: patient.profileImage ?? "",
  });

  // Updates one field and keeps the others.
  function setField(name: keyof typeof values, value: string) {
    setValues({ ...values, [name]: value });
  }

  // Sends the form to the API when submitted.
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    form.runSave(async () => {
      const updatedUser = await savePatientProfileSection(userId, "basic", {
        ...values,
        age: Number(values.age),
        weight: Number(values.weight),
        height: Number(values.height),
      });
      updateUser(updatedUser);
    }, onSaved);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {form.errorMessage && <Alert message={form.errorMessage} />}

      <FormInput
        label="Photo link"
        name="profileImage"
        value={values.profileImage}
        onChange={(value) => setField("profileImage", value)}
        placeholder="https://example.com/photo.jpg"
        hint="Optional. Paste a link to your photo."
      />

      <FormInput
        label="Full name"
        name="fullName"
        value={values.fullName}
        onChange={(value) => setField("fullName", value)}
        placeholder="Enter your full name"
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          label="Age"
          name="age"
          type="number"
          value={values.age}
          onChange={(value) => setField("age", value)}
          placeholder="Years"
          required
        />

        <FormSelect
          label="Gender"
          name="gender"
          value={values.gender}
          onChange={(value) => setField("gender", value)}
          options={PATIENT_GENDER_OPTIONS}
          placeholder="Select gender"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          label="Mobile number"
          name="mobileNumber"
          value={values.mobileNumber}
          onChange={(value) => setField("mobileNumber", value)}
          placeholder="10 digit number"
          required
        />

        <FormInput
          label="Weight (Kg)"
          name="weight"
          type="number"
          value={values.weight}
          onChange={(value) => setField("weight", value)}
          placeholder="Weight in Kg"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          label="Height (cm)"
          name="height"
          type="number"
          value={values.height}
          onChange={(value) => setField("height", value)}
          placeholder="Height in cm"
        />

        <FormSelect
          label="Blood group"
          name="bloodGroup"
          value={values.bloodGroup}
          onChange={(value) => setField("bloodGroup", value)}
          options={BLOOD_GROUPS.map((group) => ({ value: group, label: group }))}
          placeholder="Select blood group"
        />

        <FormInput
          label="City"
          name="city"
          value={values.city}
          onChange={(value) => setField("city", value)}
          placeholder="Your city"
        />
      </div>

      <SaveButton isSaving={form.isSaving} savedOk={form.savedOk} />
    </form>
  );
}
