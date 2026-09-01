import { Award, Star, Users, MessageSquare } from "lucide-react";
import StatTiles from "@/components/ui/StatTiles";
import type { Doctor } from "@/types";

// The doctor numbers row shown above the tabs.
export default function DoctorStatsRow({ doctor }: { doctor: Doctor }) {
  const tiles = [
    { Icon: Award, value: `${doctor.experienceYears} yrs`, label: "Experience" },
    { Icon: Star, value: doctor.rating, label: "Rating" },
    { Icon: Users, value: `${doctor.totalPatients}+`, label: "Patients" },
    { Icon: MessageSquare, value: doctor.totalReviews, label: "Reviews" },
  ];

  return <StatTiles tiles={tiles} />;
}
