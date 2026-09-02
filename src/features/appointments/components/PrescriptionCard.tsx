import { Pill } from "lucide-react";
import type { Medicine } from "@/types";

// Read-only prescription. The page above it shows the heading.
export default function PrescriptionCard({
  diagnosis,
  instructions,
  medicines,
}: {
  diagnosis: string;
  instructions: string;
  medicines: Medicine[];
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted">Diagnosis</p>
        <p className="mt-0.5 text-sm font-medium leading-relaxed text-ink">{diagnosis || "N/A"}</p>
      </div>

      <div>
        <p className="text-sm text-muted">Medicines</p>

        {medicines.length === 0 ? (
          <p className="mt-0.5 text-sm font-medium text-ink">None</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {medicines.map((medicine, index) => (
              <li key={index} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-2.5">
                <Pill className="h-4 w-4 shrink-0 text-brand" />
                <span className="flex-1 text-sm font-medium text-ink">{medicine.name}</span>
                {medicine.dosage && <span className="text-sm text-muted">{medicine.dosage}</span>}
                {medicine.duration && <span className="text-sm text-muted">{medicine.duration}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="text-sm text-muted">Instructions</p>
        <p className="mt-0.5 text-sm font-medium leading-relaxed text-ink">{instructions || "N/A"}</p>
      </div>
    </div>
  );
}
