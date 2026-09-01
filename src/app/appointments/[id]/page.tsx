import AppointmentDetail from "@/features/appointments/components/AppointmentDetail";

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AppointmentDetail appointmentId={id} />;
}
