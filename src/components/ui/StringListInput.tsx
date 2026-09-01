"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Chip from "@/components/ui/Chip";

type StringListInputProps = {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  hint?: string;
};

export default function StringListInput({
  label,
  items,
  onChange,
  placeholder,
  hint,
}: StringListInputProps) {
  const [newItem, setNewItem] = useState("");

  // Adds the typed item to the list, if it is not empty.
  function addItem() {
    const cleanItem = newItem.trim();
    if (!cleanItem) return;

    onChange([...items, cleanItem]);
    setNewItem("");
  }

  // Removes one item by its position in the list.
  function removeItem(indexToRemove: number) {
    onChange(items.filter((_, index) => index !== indexToRemove));
  }

  // Pressing Enter adds the item without submitting the whole form.
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      addItem();
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>

      {items.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Chip key={index} label={item} onRemove={() => removeItem(index)} />
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          placeholder={placeholder}
          onChange={(event) => setNewItem(event.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-transparent bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-card"
        />

        <button
          type="button"
          onClick={addItem}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-brand px-4 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
