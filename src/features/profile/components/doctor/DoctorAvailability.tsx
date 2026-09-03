"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import Alert from "@/components/ui/Alert";
import ChipToggleGroup from "@/components/ui/ChipToggleGroup";
import SaveButton from "@/features/profile/components/SaveButton";
import { useSaveForm } from "@/features/profile/hooks/useSaveForm";
import { saveDoctorProfileSection } from "@/features/profile/api/doctorProfileService";
import { WEEK_DAYS, SLOT_DURATIONS, BREAK_DURATIONS } from "@/lib/utils/profileOptions";
import { VISIT_TYPES, MEET_TYPES, CONSULT_TYPES } from "@/lib/utils/appointmentOptions";
import type { Doctor } from "@/types";

type DoctorAvailabilityProps = { doctor: Doctor; userId: string; onSaved?: () => void };

// Removes the option if it is on, or adds it if it is off.
function toggle(list: string[], option: string) {
  return list.includes(option) ? list.filter((one) => one !== option) : [...list, option];
}

// The doctor availability form: days, times, allowed choices and fee.
export default function DoctorAvailability({ doctor, userId, onSaved }: DoctorAvailabilityProps) {
  const form = useSaveForm();

  const [days, setDays] = useState<string[]>(doctor.availableDays ?? []);
  const [visitTypes, setVisitTypes] = useState<string[]>(doctor.visitTypes ?? []);
  const [meetTypes, setMeetTypes] = useState<string[]>(doctor.meetTypes ?? []);
  const [consultTypes, setConsultTypes] = useState<string[]>(doctor.consultTypes ?? []);
  const [values, setValues] = useState({
    startTime: doctor.startTime ?? "",
    endTime: doctor.endTime ?? "",
    slotDuration: String(doctor.slotDuration || 15),
    breakDuration: String(doctor.breakDuration ?? 0),
    consultationFee: doctor.consultationFee ? String(doctor.consultationFee) : "",
  });
  const [isAvailable, setIsAvailable] = useState(doctor.isAvailable ?? false);

  // Updates one field and keeps the others.
  function setField(name: keyof typeof values, value: string) {
    setValues({ ...values, [name]: value });
  }

  // Sends the form to the API when submitted.
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    form.runSave(async () => {
      await saveDoctorProfileSection(userId, "availability", {
        ...values,
        availableDays: days,
        visitTypes,
        meetTypes,
        consultTypes,
        slotDuration: Number(values.slotDuration),
        breakDuration: Number(values.breakDuration),
        consultationFee: Number(values.consultationFee),
        isAvailable,
      });
    }, onSaved);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {form.errorMessage && <Alert message={form.errorMessage} />}

      <ChipToggleGroup
        label="Consulting days"
        options={WEEK_DAYS}
        selected={days}
        onToggle={(day) => setDays(toggle(days, day))}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          label="Start time"
          name="startTime"
          type="time"
          value={values.startTime}
          onChange={(value) => setField("startTime", value)}
        />

        <FormInput
          label="End time"
          name="endTime"
          type="time"
          value={values.endTime}
          onChange={(value) => setField("endTime", value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelect
          label="Slot length (minutes)"
          name="slotDuration"
          value={values.slotDuration}
          onChange={(value) => setField("slotDuration", value)}
          options={SLOT_DURATIONS.map((minutes) => ({
            value: String(minutes),
            label: `${minutes} min`,
          }))}
        />

        <FormSelect
          label="Break between slots"
          name="breakDuration"
          value={values.breakDuration}
          onChange={(value) => setField("breakDuration", value)}
          options={BREAK_DURATIONS.map((minutes) => ({
            value: String(minutes),
            label: minutes === 0 ? "No break" : `${minutes} min`,
          }))}
        />
      </div>

      <FormInput
        label="Consultation fee (Rs)"
        name="consultationFee"
        type="number"
        value={values.consultationFee}
        onChange={(value) => setField("consultationFee", value)}
        placeholder="Fee for one visit"
        required
      />

      {/* Only the choices picked here are open to a patient on the booking page. */}
      <ChipToggleGroup
        label="Visit type"
        options={VISIT_TYPES}
        selected={visitTypes}
        onToggle={(option) => setVisitTypes(toggle(visitTypes, option))}
      />

      <ChipToggleGroup
        label="Meet type"
        options={MEET_TYPES}
        selected={meetTypes}
        onToggle={(option) => setMeetTypes(toggle(meetTypes, option))}
      />

      <ChipToggleGroup
        label="Consult type"
        options={CONSULT_TYPES}
        selected={consultTypes}
        onToggle={(option) => setConsultTypes(toggle(consultTypes, option))}
      />

      <label className="flex cursor-pointer items-center gap-3 px-2">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(event) => setIsAvailable(event.target.checked)}
          className="h-4 w-4 cursor-pointer accent-brand"
        />
        <span className="text-sm font-medium text-ink">Show me on the doctors list for booking</span>
      </label>

      <SaveButton isSaving={form.isSaving} savedOk={form.savedOk} />
    </form>
  );
}
