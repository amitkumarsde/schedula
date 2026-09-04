"use client";

import { formatSlotLabel } from "@/lib/utils/schedule";
import type { Slot } from "@/types";

// A grid of time slots the patient can pick from.
export default function SlotPicker({
  slots,
  selectedSlot,
  onSelect,
}: {
  slots: Slot[];
  selectedSlot: string;
  onSelect: (time: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {slots.map((slot) => {
        const isDisabled = slot.taken || slot.past;
        const isActive = slot.time === selectedSlot;

        return (
          <button
            key={slot.time}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelect(slot.time)}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
              isDisabled
                ? "cursor-not-allowed border-line bg-surface text-muted opacity-40"
                : isActive
                  ? "cursor-pointer border-brand bg-brand text-on-brand"
                  : "cursor-pointer border-line bg-card text-ink hover:border-brand"
            }`}
          >
            {formatSlotLabel(slot.time)}
          </button>
        );
      })}
    </div>
  );
}
