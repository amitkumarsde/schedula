"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import Alert from "@/components/ui/Alert";
import ProfileField from "@/features/profile/components/ProfileField";
import EditableCard from "@/features/profile/components/EditableCard";
import EditActions from "@/features/profile/components/EditActions";
import { useEditableSection } from "@/features/profile/hooks/useEditableSection";
import { saveDoctorProfileSection } from "@/features/profile/api/doctorProfileService";
import { WEEK_DAYS, SLOT_DURATIONS } from "@/lib/utils/profileOptions";
import type { Doctor } from "@/types";

type DoctorAvailabilityProps = { doctor: Doctor; userId: string; onSaved: () => void };

// Shows a start and end time, or empty when not set.
function showTimeRange(start: string, end: string) {
  return start && end ? `${start} - ${end}` : "";
}

// The doctor availability tab: days, times, slots and fee.
export default function DoctorAvailability({ doctor, userId, onSaved }: DoctorAvailabilityProps) {
  const editor = useEditableSection(onSaved);

  const [days, setDays] = useState<string[]>(doctor.availableDays ?? []);
  const [values, setValues] = useState({
    morningStartTime: doctor.morningStartTime ?? "",
    morningEndTime: doctor.morningEndTime ?? "",
    eveningStartTime: doctor.eveningStartTime ?? "",
    eveningEndTime: doctor.eveningEndTime ?? "",
    slotDurationMinutes: String(doctor.slotDurationMinutes || 15),
    consultationFee: doctor.consultationFee ? String(doctor.consultationFee) : "",
  });
  const [isAvailable, setIsAvailable] = useState(doctor.isAvailable ?? false);

  // Updates one field and keeps the others.
  function setField(name: keyof typeof values, value: string) {
    setValues({ ...values, [name]: value });
  }

  // Adds the day if it is off, or removes it if it is already on.
  function toggleDay(day: string) {
    setDays(days.includes(day) ? days.filter((one) => one !== day) : [...days, day]);
  }

  // Sends the form to the API when submitted.
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    editor.runSave(async () => {
      await saveDoctorProfileSection(userId, "availability", {
        ...values,
        availableDays: days,
        slotDurationMinutes: Number(values.slotDurationMinutes),
        consultationFee: Number(values.consultationFee),
        isAvailable,
      });
    });
  }

  if (!editor.isEditing) {
    return (
      <EditableCard title="Availability" onEdit={editor.openEditor}>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          <ProfileField label="Consulting days" value={doctor.availableDays.join(", ")} />
          <ProfileField
            label="Morning time"
            value={showTimeRange(doctor.morningStartTime, doctor.morningEndTime)}
          />
          <ProfileField
            label="Evening time"
            value={showTimeRange(doctor.eveningStartTime, doctor.eveningEndTime)}
          />
          <ProfileField label="Slot length" value={`${doctor.slotDurationMinutes} min`} />
          <ProfileField
            label="Consultation fee"
            value={doctor.consultationFee ? `Rs ${doctor.consultationFee}` : ""}
          />
          <ProfileField label="Listed for booking" value={doctor.isAvailable ? "Yes" : "No"} />
        </div>
      </EditableCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-line bg-card p-6">
      <h3 className="font-bold text-ink">Edit availability</h3>

      {editor.errorMessage && <Alert message={editor.errorMessage} />}

      <div>
        <p className="mb-1.5 text-sm font-medium text-ink">Consulting days</p>

        <div className="flex flex-wrap gap-2">
          {WEEK_DAYS.map((day) => {
            const isOn = days.includes(day);

            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isOn
                    ? "border-brand bg-brand text-on-brand"
                    : "border-line bg-card text-muted hover:border-brand hover:text-brand"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          label="Morning start"
          name="morningStartTime"
          type="time"
          value={values.morningStartTime}
          onChange={(value) => setField("morningStartTime", value)}
        />

        <FormInput
          label="Morning end"
          name="morningEndTime"
          type="time"
          value={values.morningEndTime}
          onChange={(value) => setField("morningEndTime", value)}
        />

        <FormInput
          label="Evening start"
          name="eveningStartTime"
          type="time"
          value={values.eveningStartTime}
          onChange={(value) => setField("eveningStartTime", value)}
        />

        <FormInput
          label="Evening end"
          name="eveningEndTime"
          type="time"
          value={values.eveningEndTime}
          onChange={(value) => setField("eveningEndTime", value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelect
          label="Slot length (minutes)"
          name="slotDurationMinutes"
          value={values.slotDurationMinutes}
          onChange={(value) => setField("slotDurationMinutes", value)}
          options={SLOT_DURATIONS.map((minutes) => ({
            value: String(minutes),
            label: `${minutes} min`,
          }))}
        />

        <FormInput
          label="Consultation fee (Rs)"
          name="consultationFee"
          type="number"
          value={values.consultationFee}
          onChange={(value) => setField("consultationFee", value)}
          placeholder="Fee for one visit"
          required
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(event) => setIsAvailable(event.target.checked)}
          className="h-4 w-4 cursor-pointer accent-brand"
        />
        <span className="text-sm font-medium text-ink">Show me on the doctors list for booking</span>
      </label>

      <EditActions isSaving={editor.isSaving} onCancel={editor.closeEditor} />
    </form>
  );
}
