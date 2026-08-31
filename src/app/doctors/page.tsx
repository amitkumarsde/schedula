import { Suspense } from "react";
import DoctorsBrowser from "@/features/doctors/components/DoctorsBrowser";

// The doctors page. Suspense is required because the browser reads the URL query.
export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10 text-muted">Loading...</div>}>
      <DoctorsBrowser />
    </Suspense>
  );
}
