"use client";

import type { ReactNode } from "react";
import { Pencil } from "lucide-react";

type EditableSectionProps = {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  children: ReactNode;
};

// A profile card that shows the read view, with an Edit button that swaps in the form.
export default function EditableSection({ title, isEditing, onEdit, onCancel, children }: EditableSectionProps) {
  return (
    <section className="rounded-2xl border border-line bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-ink">{title}</h3>

        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer text-sm font-medium text-muted hover:text-ink"
          >
            Cancel
          </button>
        ) : (
          <button
            type="button"
            onClick={onEdit}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        )}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}
