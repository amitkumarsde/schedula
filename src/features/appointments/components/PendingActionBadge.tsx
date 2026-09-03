import type { UserRole } from "@/types";

// Shown when a slot time has passed but the visit is not finished yet.
// The doctor is asked to act; the patient is told to wait.
export default function PendingActionBadge({ viewerRole }: { viewerRole: UserRole }) {
  const isDoctor = viewerRole === "doctor";
  const label = isDoctor ? "Action required" : "Awaiting doctor";
  const style = isDoctor ? "bg-warning-soft text-warning" : "bg-surface text-muted";

  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}
