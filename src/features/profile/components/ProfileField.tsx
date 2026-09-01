// Shows one label with its value.
export default function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium break-words text-ink">{value || "N/A"}</p>
    </div>
  );
}
