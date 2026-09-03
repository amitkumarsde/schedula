"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import DoctorDashboard from "@/features/dashboard/components/DoctorDashboard";
import PatientDashboard from "@/features/dashboard/components/PatientDashboard";

// Shows the doctor or patient dashboard based on who is logged in.
export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) return null;

  return user.role === "doctor" ? <DoctorDashboard /> : <PatientDashboard />;
}
