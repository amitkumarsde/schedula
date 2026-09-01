"use client";

import { useState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import FormTextarea from "@/components/ui/FormTextarea";
import StringListInput from "@/components/ui/StringListInput";
import { savePrescription, updateAppointmentStatus } from "@/features/appointments/api/appointmentService";

type DoctorPrescriptionFormProps = {
  appointmentId: string;
  userId: string;
  initialDescription: string;
  initialMedicines: string[];
  onUpdated: () => void;
};

// The doctor adds a prescription, then marks the visit completed.
export default function DoctorPrescriptionForm({
  appointmentId,
  userId,
  initialDescription,
  initialMedicines,
  onUpdated,
}: DoctorPrescriptionFormProps) {
  const [description, setDescription] = useState(initialDescription);
  const [medicines, setMedicines] = useState<string[]>(initialMedicines);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  // Saves the prescription so far, without completing the visit.
  async function handleSave() {
    setErrorMessage("");
    setSavedMessage("");
    setIsBusy(true);

    try {
      await savePrescription(appointmentId, userId, description, medicines);
      setSavedMessage("Prescription saved.");
      onUpdated();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not save the prescription");
    } finally {
      setIsBusy(false);
    }
  }

  // Saves first, then marks the appointment completed.
  async function handleComplete() {
    if (!description.trim()) {
      setErrorMessage("Please write a prescription description before completing.");
      return;
    }

    setErrorMessage("");
    setSavedMessage("");
    setIsBusy(true);

    try {
      await savePrescription(appointmentId, userId, description, medicines);
      await updateAppointmentStatus(appointmentId, userId, "completed");
      onUpdated();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not complete the appointment");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-line bg-card p-6">
      <h2 className="font-bold text-ink">Add prescription</h2>

      {errorMessage && <Alert message={errorMessage} />}
      {savedMessage && <p className="text-sm font-medium text-success">{savedMessage}</p>}

      <FormTextarea
        label="Description"
        name="prescriptionDescription"
        value={description}
        onChange={setDescription}
        placeholder="Advice, diagnosis or notes for the patient"
      />

      <StringListInput
        label="Medicines"
        items={medicines}
        onChange={setMedicines}
        placeholder="Type a medicine and press Add"
        hint="Add each medicine one by one."
      />

      <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
        <Button onClick={handleComplete} disabled={isBusy} fullWidth>
          {isBusy ? "Please wait..." : "Save & mark completed"}
        </Button>

        <Button variant="outline" onClick={handleSave} disabled={isBusy} fullWidth>
          Save prescription
        </Button>
      </div>
    </section>
  );
}
