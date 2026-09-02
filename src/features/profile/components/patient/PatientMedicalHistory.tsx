"use client";

import { useState } from "react";
import StringListInput from "@/components/ui/StringListInput";
import Alert from "@/components/ui/Alert";
import SaveButton from "@/features/profile/components/SaveButton";
import { useSaveForm } from "@/features/profile/hooks/useSaveForm";
import { savePatientProfileSection } from "@/features/profile/api/patientProfileService";
import type { Patient } from "@/types";

type PatientMedicalHistoryProps = { patient: Patient; userId: string };

// The patient medical history form.
export default function PatientMedicalHistory({ patient, userId }: PatientMedicalHistoryProps) {
  const form = useSaveForm();
  const [allergies, setAllergies] = useState<string[]>(patient.allergies ?? []);
  const [diseases, setDiseases] = useState<string[]>(patient.diseases ?? []);
  const [currentMedications, setCurrentMedications] = useState<string[]>(patient.currentMedications ?? []);

  // Sends the form to the API when submitted.
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    form.runSave(async () => {
      await savePatientProfileSection(userId, "medical", { allergies, diseases, currentMedications });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-ink">Medical history</h3>

      {form.errorMessage && <Alert message={form.errorMessage} />}

      <StringListInput
        label="Allergies"
        items={allergies}
        onChange={setAllergies}
        placeholder="Type an allergy and press Add"
        hint="Add each allergy one by one. Leave empty if you have none."
      />

      <StringListInput
        label="Diseases"
        items={diseases}
        onChange={setDiseases}
        placeholder="Type a disease and press Add"
        hint="Add each disease one by one. Leave empty if you have none."
      />

      <StringListInput
        label="Current medications"
        items={currentMedications}
        onChange={setCurrentMedications}
        placeholder="Type a medicine and press Add"
        hint="Medicines you take now. Leave empty if none."
      />

      <SaveButton isSaving={form.isSaving} savedOk={form.savedOk} />
    </form>
  );
}
