import { Pencil } from "lucide-react";
import type { ReactNode } from "react";

// A card with a title and an edit icon.
export default function EditableCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink">{title}</h3>

        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-brand hover:text-brand"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}
