import DoctorProfileView from "@/features/doctors/components/DoctorProfileView";

export default async function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DoctorProfileView doctorId={id} />;
}
