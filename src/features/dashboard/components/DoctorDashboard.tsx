"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, CheckCircle2, Users } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMyAppointments } from "@/features/appointments/hooks/useMyAppointments";
import { useDoctorProfile } from "@/features/profile/hooks/useDoctorProfile";
import { rescheduleAppointment } from "@/features/appointments/api/appointmentService";
import AppCalendar from "@/components/ui/AppCalendar";
import SummaryCard from "@/components/ui/SummaryCard";
import DayCalendar from "@/features/appointments/components/DayCalendar";
import { makeSlots, weekdayName, todayDateText } from "@/lib/utils/schedule";
import { toast } from "react-toastify";
import type { Appointment } from "@/types";

// The colour key shown under the calendar.
const LEGEND = [
  { label: "Upcoming", dotClass: "bg-brand" },
  { label: "Completed", dotClass: "bg-success" },
];

// The doctor's home: stats on top, then the appointment calendar with reschedule.
export default function DoctorDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { appointments, isLoading, reloadAppointments } = useMyAppointments(user?._id ?? "");
  const { doctorProfile } = useDoctorProfile(user?._id ?? "");

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(todayDateText());

  const historyMin = new Date(today.getFullYear(), today.getMonth() - 4, 1);
  const rescheduleMax = new Date(today.getFullYear(), today.getMonth() + 3, 0);

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [pickedUpId, setPickedUpId] = useState<string | null>(null);

  // The dashboard is only for doctors.
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) router.push("/login");
    else if (user.role !== "doctor") router.push("/appointments");
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || !user || user.role !== "doctor") return null;

  const todayText = todayDateText();

  const todayCount = appointments.filter(
    (one) => one.appointmentDate === todayText && one.status !== "cancelled"
  ).length;
  const upcomingCount = appointments.filter((one) => one.status === "upcoming").length;
  const completedCount = appointments.filter((one) => one.status === "completed").length;
  const totalPatients = new Set(appointments.map((one) => one.patientUserId)).size;

  const stats = [
    { Icon: CalendarDays, label: "Today's patients", value: todayCount },
    { Icon: Clock, label: "Upcoming", value: upcomingCount },
    { Icon: CheckCircle2, label: "Completed", value: completedCount },
    { Icon: Users, label: "Total patients", value: totalPatients },
  ];

  // Count the appointments on each date, ignoring cancelled ones.
  const countsByDate: Record<string, number> = {};
  for (const appointment of appointments) {
    if (appointment.status === "cancelled") continue;
    countsByDate[appointment.appointmentDate] = (countsByDate[appointment.appointmentDate] ?? 0) + 1;
  }

  // The appointments on the selected day, grouped by their time.
  const dayAppointments = appointments.filter((one) => one.appointmentDate === selectedDate);
  const appointmentsByTime: Record<string, Appointment[]> = {};
  for (const appointment of dayAppointments) {
    (appointmentsByTime[appointment.slotTime] ??= []).push(appointment);
  }

  // The time slots come from the doctor's own profile.
  const isWorkingDay = doctorProfile ? doctorProfile.availableDays.includes(weekdayName(selectedDate)) : false;
  const slotTimes =
    isWorkingDay && doctorProfile
      ? makeSlots(
          doctorProfile.startTime,
          doctorProfile.endTime,
          doctorProfile.slotDuration,
          doctorProfile.breakDuration
        )
      : [];
  const times = Array.from(new Set([...slotTimes, ...dayAppointments.map((a) => a.slotTime)])).sort();

  // Moves one appointment to the selected day and the chosen time.
  async function reschedule(appointmentId: string | null, time: string) {
    if (!appointmentId || !user) return;

    try {
      await rescheduleAppointment(appointmentId, user._id, selectedDate, time);
      toast.success("Appointment rescheduled. The patient has been notified.");
      reloadAppointments();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reschedule");
    } finally {
      setDraggedId(null);
      setPickedUpId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Dashboard</h1>
      <p className="mt-1.5 text-sm text-muted">Welcome back, {user.fullName}.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <SummaryCard key={stat.label} Icon={stat.Icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-ink">Appointment calendar</h2>
      <p className="mt-1 text-sm text-muted">
        Move an appointment up to two months ahead; browse up to four months back to see history.
      </p>

      {isLoading ? (
        <div className="mt-4 h-96 animate-pulse rounded-2xl bg-surface" />
      ) : (
        <>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <AppCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              availableDays={doctorProfile?.availableDays}
              countsByDate={countsByDate}
              minDate={historyMin}
              maxDate={rescheduleMax}
            />

            <DayCalendar
              selectedDate={selectedDate}
              times={times}
              appointmentsByTime={appointmentsByTime}
              viewerRole={user.role}
              pickedUpId={pickedUpId}
              onOpenDetail={(id) => router.push(`/appointments/${id}`)}
              onPickUp={(id) => setPickedUpId((current) => (current === id ? null : id))}
              onDragStart={setDraggedId}
              onDropOnTime={(time) => reschedule(draggedId, time)}
              onClickTime={(time) => reschedule(pickedUpId, time)}
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-4">
            {LEGEND.map((item) => (
              <span key={item.label} className="flex items-center gap-2 text-sm text-muted">
                <span className={`h-3 w-3 rounded-full ${item.dotClass}`} />
                {item.label}
              </span>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
