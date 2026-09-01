import BookingFlow from "@/features/appointments/components/BookingFlow";

export default async function BookAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookingFlow doctorId={id} />;
}
