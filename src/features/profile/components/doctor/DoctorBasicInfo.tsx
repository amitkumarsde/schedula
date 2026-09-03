"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import Alert from "@/components/ui/Alert";
import SaveButton from "@/features/profile/components/SaveButton";
import { useSaveForm } from "@/features/profile/hooks/useSaveForm";
import { saveDoctorProfileSection } from "@/features/profile/api/doctorProfileService";
import { useAuth } from "@/lib/auth/AuthContext";
import { DOCTOR_GENDER_OPTIONS } from "@/lib/utils/profileOptions";
import type { Doctor } from "@/types";

type DoctorBasicInfoProps = { doctor: Doctor; userId: string; onSaved?: () => void };

// The doctor basic info form.
export default function DoctorBasicInfo({ doctor, userId, onSaved }: DoctorBasicInfoProps) {
  const { updateUser } = useAuth();
  const form = useSaveForm();

  const [values, setValues] = useState({
    fullName: doctor.fullName ?? "",
    gender: doctor.gender ?? "",
    mobileNumber: doctor.mobileNumber ?? "",
    city: doctor.city ?? "",
    profileImage: doctor.profileImage ?? "",
  });

  // Updates one field and keeps the others.
  function setField(name: keyof typeof values, value: string) {
    setValues({ ...values, [name]: value });
  }

  // Sends the form to the API when submitted.
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    form.runSave(async () => {
      const updatedUser = await saveDoctorProfileSection(userId, "basic", values);
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
        hint="Optional. Patients see this photo in the doctors list."
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
        <FormSelect
          label="Gender"
          name="gender"
          value={values.gender}
          onChange={(value) => setField("gender", value)}
          options={DOCTOR_GENDER_OPTIONS}
          placeholder="Select gender"
          required
        />

        <FormInput
          label="Mobile number"
          name="mobileNumber"
          value={values.mobileNumber}
          onChange={(value) => setField("mobileNumber", value)}
          placeholder="10 digit number"
          required
        />
      </div>

      <FormInput
        label="City"
        name="city"
        value={values.city}
        onChange={(value) => setField("city", value)}
        placeholder="Your city"
        required
      />

      <SaveButton isSaving={form.isSaving} savedOk={form.savedOk} />
    </form>
  );
}
