import type { UserRole } from "@/types";

// Shown when a slot time has passed but the visit is not finished yet.
export default function PendingActionBadge({ viewerRole }: { viewerRole: UserRole }) {
  const label = viewerRole === "doctor" ? "Action required" : "Awaiting doctor";

  return (
    <span className="inline-block whitespace-nowrap rounded-full bg-warning-soft px-3 py-1 text-xs font-semibold text-warning">
      {label}
    </span>
  );
}
