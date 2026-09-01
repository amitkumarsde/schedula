import Avatar from "@/components/ui/Avatar";

type DoctorSummaryCardProps = {
  name: string;
  specialization: string;
  qualification?: string;
  imageUrl: string;
};

// A small doctor card used on the booking and appointment pages.
export default function DoctorSummaryCard({
  name,
  specialization,
  qualification,
  imageUrl,
}: DoctorSummaryCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-card p-4">
      <Avatar imageUrl={imageUrl} fullName={name} size={72} />

      <div className="min-w-0">
        <h3 className="truncate text-lg font-bold text-ink">{name}</h3>
        {specialization && <p className="text-sm font-medium text-brand">{specialization}</p>}
        {qualification && <p className="mt-0.5 truncate text-sm text-muted">{qualification}</p>}
      </div>
    </div>
  );
}
