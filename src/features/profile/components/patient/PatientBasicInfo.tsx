"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import Alert from "@/components/ui/Alert";
import ProfileField from "@/features/profile/components/ProfileField";
import EditableCard from "@/features/profile/components/EditableCard";
import EditActions from "@/features/profile/components/EditActions";
import { useEditableSection } from "@/features/profile/hooks/useEditableSection";
import { savePatientProfileSection } from "@/features/profile/api/patientProfileService";
import { useAuth } from "@/lib/auth/AuthContext";
import { BLOOD_GROUPS, PATIENT_GENDER_OPTIONS, getGenderLabel } from "@/lib/utils/profileOptions";
import type { Patient } from "@/types";

type PatientBasicInfoProps = { patient: Patient; userId: string; onSaved: () => void };

// The patient basic info tab.
export default function PatientBasicInfo({ patient, userId, onSaved }: PatientBasicInfoProps) {
  const { updateUser } = useAuth();
  const editor = useEditableSection(onSaved);

  // The form values, kept as text while the user is typing.
  const [values, setValues] = useState({
    fullName: patient.fullName ?? "",
    age: patient.age ? String(patient.age) : "",
    gender: patient.gender ?? "",
    mobileNumber: patient.mobileNumber ?? "",
    weight: patient.weight ? String(patient.weight) : "",
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
    editor.runSave(async () => {
      const updatedUser = await savePatientProfileSection(userId, "basic", {
        ...values,
        age: Number(values.age),
        weight: Number(values.weight),
      });
      updateUser(updatedUser);
    });
  }

  if (!editor.isEditing) {
    return (
      <EditableCard title="Basic info" onEdit={editor.openEditor}>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          <ProfileField label="Full name" value={patient.fullName} />
          <ProfileField label="Age" value={patient.age ? `${patient.age} years` : ""} />
          <ProfileField label="Gender" value={patient.gender ? getGenderLabel(patient.gender) : ""} />
          <ProfileField label="Weight" value={patient.weight ? `${patient.weight} Kg` : ""} />
          <ProfileField label="Blood group" value={patient.bloodGroup} />
          <ProfileField label="Mobile number" value={patient.mobileNumber} />
          <ProfileField label="City" value={patient.city} />
        </div>
      </EditableCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-card p-6">
      <h3 className="font-bold text-ink">Edit basic info</h3>

      {editor.errorMessage && <Alert message={editor.errorMessage} />}

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

      <EditActions isSaving={editor.isSaving} onCancel={editor.closeEditor} />
    </form>
  );
}
