"use client";

import { useState } from "react";
import StringListInput from "@/components/ui/StringListInput";
import Chip from "@/components/ui/Chip";
import Alert from "@/components/ui/Alert";
import EditableCard from "@/features/profile/components/EditableCard";
import EditActions from "@/features/profile/components/EditActions";
import { useEditableSection } from "@/features/profile/hooks/useEditableSection";
import { savePatientProfileSection } from "@/features/profile/api/patientProfileService";
import type { Patient } from "@/types";

type PatientMedicalHistoryProps = { patient: Patient; userId: string; onSaved: () => void };

// Shows a list of items as chips.
function ChipList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>

      {items.length === 0 ? (
        <p className="mt-1 text-sm font-medium text-ink">Not added</p>
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

// The patient medical history tab.
export default function PatientMedicalHistory({
  patient,
  userId,
  onSaved,
}: PatientMedicalHistoryProps) {
  const editor = useEditableSection(onSaved);
  const [allergies, setAllergies] = useState<string[]>(patient.allergies ?? []);
  const [diseases, setDiseases] = useState<string[]>(patient.diseases ?? []);

  // Sends the form to the API when submitted.
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    editor.runSave(async () => {
      await savePatientProfileSection(userId, "medical", { allergies, diseases });
    });
  }

  if (!editor.isEditing) {
    return (
      <EditableCard title="Medical history" onEdit={editor.openEditor}>
        <div className="space-y-5">
          <ChipList label="Allergies" items={patient.allergies} />
          <ChipList label="Diseases" items={patient.diseases} />
        </div>
      </EditableCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-card p-6">
      <h3 className="font-bold text-ink">Edit medical history</h3>

      {editor.errorMessage && <Alert message={editor.errorMessage} />}

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

      <EditActions isSaving={editor.isSaving} onCancel={editor.closeEditor} />
    </form>
  );
}
