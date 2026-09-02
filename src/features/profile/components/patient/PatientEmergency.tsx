"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import Alert from "@/components/ui/Alert";
import SaveButton from "@/features/profile/components/SaveButton";
import { useSaveForm } from "@/features/profile/hooks/useSaveForm";
import { savePatientProfileSection } from "@/features/profile/api/patientProfileService";
import type { Patient } from "@/types";

type PatientEmergencyProps = { patient: Patient; userId: string };

// The emergency contact and insurance form.
export default function PatientEmergency({ patient, userId }: PatientEmergencyProps) {
  const form = useSaveForm();
  const [values, setValues] = useState({
    emergencyName: patient.emergencyName ?? "",
    emergencyPhone: patient.emergencyPhone ?? "",
    emergencyRelation: patient.emergencyRelation ?? "",
    insuranceProvider: patient.insuranceProvider ?? "",
    insurancePolicyNumber: patient.insurancePolicyNumber ?? "",
  });

  // Updates one field and keeps the others.
  function setField(name: keyof typeof values, value: string) {
    setValues({ ...values, [name]: value });
  }

  // Sends the form to the API when submitted.
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    form.runSave(async () => {
      await savePatientProfileSection(userId, "emergency", values);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-ink">Emergency contact</h3>

      {form.errorMessage && <Alert message={form.errorMessage} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          label="Name"
          name="emergencyName"
          value={values.emergencyName}
          onChange={(value) => setField("emergencyName", value)}
          placeholder="Contact name"
        />

        <FormInput
          label="Phone"
          name="emergencyPhone"
          value={values.emergencyPhone}
          onChange={(value) => setField("emergencyPhone", value)}
          placeholder="10 digit number"
        />
      </div>

      <FormInput
        label="Relation"
        name="emergencyRelation"
        value={values.emergencyRelation}
        onChange={(value) => setField("emergencyRelation", value)}
        placeholder="Father, spouse, friend, etc"
      />

      <h3 className="pt-2 font-bold text-ink">Insurance</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          label="Provider"
          name="insuranceProvider"
          value={values.insuranceProvider}
          onChange={(value) => setField("insuranceProvider", value)}
          placeholder="Insurance company"
        />

        <FormInput
          label="Policy number"
          name="insurancePolicyNumber"
          value={values.insurancePolicyNumber}
          onChange={(value) => setField("insurancePolicyNumber", value)}
          placeholder="Policy number"
        />
      </div>

      <SaveButton isSaving={form.isSaving} savedOk={form.savedOk} />
    </form>
  );
}
