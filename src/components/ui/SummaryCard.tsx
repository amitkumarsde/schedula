import type { ComponentType } from "react";

// A small stat card used on the dashboard and the profile.
export default function SummaryCard({
  Icon,
  label,
  value,
}: {
  Icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-card p-5 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft">
        <Icon className="h-5 w-5 text-brand" />
      </span>
      <span className="text-lg font-bold text-ink">{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}
