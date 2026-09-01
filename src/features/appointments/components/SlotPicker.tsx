"use client";

import { formatSlotLabel } from "@/lib/utils/schedule";
import type { Slot } from "@/types";

// One group of slots, like morning or evening.
function SlotGroup({
  title,
  slots,
  selectedSlot,
  onSelect,
}: {
  title: string;
  slots: Slot[];
  selectedSlot: string;
  onSelect: (time: string) => void;
}) {
  if (slots.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-muted">{title}</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((slot) => {
          const isActive = slot.time === selectedSlot;

          return (
            <button
              key={slot.time}
              type="button"
              disabled={slot.taken}
              onClick={() => onSelect(slot.time)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                slot.taken
                  ? "cursor-not-allowed border-line bg-surface text-muted line-through"
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
    </div>
  );
}

// Shows the slots split into morning and evening.
export default function SlotPicker({
  slots,
  selectedSlot,
  onSelect,
}: {
  slots: Slot[];
  selectedSlot: string;
  onSelect: (time: string) => void;
}) {
  const morningSlots = slots.filter((slot) => slot.time < "12:00");
  const eveningSlots = slots.filter((slot) => slot.time >= "12:00");

  return (
    <div className="space-y-5">
      <SlotGroup title="Morning slots" slots={morningSlots} selectedSlot={selectedSlot} onSelect={onSelect} />
      <SlotGroup title="Evening slots" slots={eveningSlots} selectedSlot={selectedSlot} onSelect={onSelect} />
    </div>
  );
}
