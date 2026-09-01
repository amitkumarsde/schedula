import { X } from "lucide-react";

export default function Chip({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand">
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="cursor-pointer hover:text-brand-dark"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
}
