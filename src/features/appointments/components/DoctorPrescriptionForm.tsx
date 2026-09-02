"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import { savePrescription, updateAppointmentStatus } from "@/features/appointments/api/appointmentService";
import { toast } from "react-toastify";
import type { Medicine } from "@/types";

type DoctorPrescriptionFormProps = {
  appointmentId: string;
  userId: string;
  initialDiagnosis: string;
  initialInstructions: string;
  initialMedicines: Medicine[];
  isCompleted: boolean;
  onUpdated: () => void;
};

const EMPTY_MEDICINE: Medicine = { name: "", dosage: "", duration: "" };

// The input style shared by the medicine rows.
const MEDICINE_INPUT =
  "rounded-xl border border-transparent bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-card";

// The doctor writes or edits a prescription, then can mark the visit completed.
export default function DoctorPrescriptionForm({
  appointmentId,
  userId,
  initialDiagnosis,
  initialInstructions,
  initialMedicines,
  isCompleted,
  onUpdated,
}: DoctorPrescriptionFormProps) {
  const [diagnosis, setDiagnosis] = useState(initialDiagnosis);
  const [instructions, setInstructions] = useState(initialInstructions);
  const [medicines, setMedicines] = useState<Medicine[]>(
    initialMedicines.length ? initialMedicines : [EMPTY_MEDICINE]
  );
  const [isBusy, setIsBusy] = useState(false);

  // Updates one field of one medicine row.
  function setMedicine(index: number, field: keyof Medicine, value: string) {
    setMedicines(medicines.map((one, i) => (i === index ? { ...one, [field]: value } : one)));
  }

  function addMedicine() {
    setMedicines([...medicines, { ...EMPTY_MEDICINE }]);
  }

  function removeMedicine(index: number) {
    setMedicines(medicines.filter((_, i) => i !== index));
  }

  // Keeps only medicine rows that have a name.
  function cleanMedicines() {
    return medicines
      .map((one) => ({ ...one, name: one.name.trim() }))
      .filter((one) => one.name.length > 0);
  }

  // Saves the prescription without changing the status.
  async function handleSave() {
    setIsBusy(true);
    try {
      await savePrescription(appointmentId, userId, {
        diagnosis,
        instructions,
        medicines: cleanMedicines(),
      });
      toast.success("Prescription saved");
      onUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the prescription");
    } finally {
      setIsBusy(false);
    }
  }

  // Saves first, then marks the appointment completed.
  async function handleComplete() {
    if (!diagnosis.trim()) {
      toast.error("Please write a diagnosis before completing.");
      return;
    }

    setIsBusy(true);
    try {
      await savePrescription(appointmentId, userId, {
        diagnosis,
        instructions,
        medicines: cleanMedicines(),
      });
      await updateAppointmentStatus(appointmentId, userId, "completed");
      toast.success("Appointment completed");
      onUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not complete the appointment");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-ink">{isCompleted ? "Edit prescription" : "Add prescription"}</h2>

      <FormInput
        label="Diagnosis"
        name="diagnosis"
        value={diagnosis}
        onChange={setDiagnosis}
        placeholder="What is the diagnosis?"
      />

      <div>
        <p className="mb-1.5 text-sm font-medium text-ink">Medicines</p>

        <div className="space-y-2">
          {medicines.map((medicine, index) => (
            <div key={index} className="flex flex-col gap-2 sm:flex-row">
              <input
                value={medicine.name}
                onChange={(event) => setMedicine(index, "name", event.target.value)}
                placeholder="Medicine name"
                className={`${MEDICINE_INPUT} flex-1`}
              />
              <input
                value={medicine.dosage}
                onChange={(event) => setMedicine(index, "dosage", event.target.value)}
                placeholder="Dosage"
                className={`${MEDICINE_INPUT} w-full sm:w-32`}
              />
              <input
                value={medicine.duration}
                onChange={(event) => setMedicine(index, "duration", event.target.value)}
                placeholder="Duration"
                className={`${MEDICINE_INPUT} w-full sm:w-32`}
              />
              <button
                type="button"
                onClick={() => removeMedicine(index)}
                aria-label="Remove medicine"
                className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl px-3 text-muted hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addMedicine}
          className="mt-2 flex cursor-pointer items-center gap-1.5 rounded-xl border border-brand px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
        >
          <Plus className="h-4 w-4" />
          Add medicine
        </button>
      </div>

      <FormTextarea
        label="Instructions"
        name="instructions"
        value={instructions}
        onChange={setInstructions}
        placeholder="Advice or notes for the patient"
      />

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button variant="outline" onClick={handleSave} disabled={isBusy}>
          Save prescription
        </Button>

        {!isCompleted && (
          <Button onClick={handleComplete} disabled={isBusy}>
            {isBusy ? "Please wait..." : "Save & mark completed"}
          </Button>
        )}
      </div>
    </div>
  );
}
