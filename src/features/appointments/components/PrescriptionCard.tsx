import { Pill, FileText } from "lucide-react";

// Read-only prescription, shown to the patient and the doctor once it is added.
export default function PrescriptionCard({
  description,
  medicines,
}: {
  description: string;
  medicines: string[];
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-line bg-card p-6">
      <h2 className="flex items-center gap-2 font-bold text-ink">
        <FileText className="h-5 w-5 text-brand" />
        Prescription
      </h2>

      <div>
        <p className="text-sm text-muted">Doctor&apos;s note</p>
        <p className="mt-1 text-sm leading-relaxed text-ink">{description || "N/A"}</p>
      </div>

      <div>
        <p className="text-sm text-muted">Medicines</p>

        {medicines.length === 0 ? (
          <p className="mt-1 text-sm text-ink">None</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {medicines.map((medicine, index) => (
              <li
                key={index}
                className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink"
              >
                <Pill className="h-4 w-4 text-brand" />
                {medicine}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
