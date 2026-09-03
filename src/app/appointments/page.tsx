import { Suspense } from "react";
import AppointmentList from "@/features/appointments/components/AppointmentList";

// Suspense is required because the list reads the status tab from the URL query.
export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-10 text-muted">Loading...</div>}>
      <AppointmentList />
    </Suspense>
  );
}
