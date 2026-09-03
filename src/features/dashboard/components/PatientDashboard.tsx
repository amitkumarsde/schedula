"use client";

import { useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle2, CalendarDays, Stethoscope } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMyAppointments } from "@/features/appointments/hooks/useMyAppointments";
import AppCalendar from "@/components/ui/AppCalendar";
import SummaryCard from "@/components/ui/SummaryCard";
import DayCalendar from "@/features/appointments/components/DayCalendar";
import { todayDateText } from "@/lib/utils/schedule";
import type { Appointment } from "@/types";

// The colour key shown under the calendar.
const LEGEND = [
  { label: "Upcoming", dotClass: "bg-brand" },
  { label: "Completed", dotClass: "bg-success" },
];

// The patient's home: stats on top, then a read-only calendar of their appointments.
export default function PatientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { appointments, isLoading } = useMyAppointments(user?._id ?? "");

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(todayDateText());

  const historyMin = new Date(today.getFullYear(), today.getMonth() - 4, 1);
  const futureMax = new Date(today.getFullYear(), today.getMonth() + 3, 0);

  if (!user) return null;

  const todayText = todayDateText();
  const todayCount = appointments.filter(
    (one) => one.appointmentDate === todayText && one.status !== "cancelled"
  ).length;
  const upcomingCount = appointments.filter((one) => one.status === "upcoming").length;
  const completedCount = appointments.filter((one) => one.status === "completed").length;

  const stats: { Icon: ComponentType<{ className?: string }>; label: string; value: number; href?: string }[] = [
    { Icon: Stethoscope, label: "Today's doctors", value: todayCount },
    { Icon: Clock, label: "Upcoming", value: upcomingCount, href: "/appointments?status=upcoming" },
    { Icon: CheckCircle2, label: "Completed", value: completedCount, href: "/appointments?status=completed" },
    { Icon: CalendarDays, label: "Total appointments", value: appointments.length },
  ];

  // The calendar shows only upcoming and completed appointments.
  const shown = appointments.filter((one) => one.status === "upcoming" || one.status === "completed");

  const countsByDate: Record<string, number> = {};
  for (const appointment of shown) {
    countsByDate[appointment.appointmentDate] = (countsByDate[appointment.appointmentDate] ?? 0) + 1;
  }

  // The appointments on the selected day, grouped by their time.
  const dayAppointments = shown.filter((one) => one.appointmentDate === selectedDate);
  const appointmentsByTime: Record<string, Appointment[]> = {};
  for (const appointment of dayAppointments) {
    (appointmentsByTime[appointment.slotTime] ??= []).push(appointment);
  }
  const times = Array.from(new Set(dayAppointments.map((one) => one.slotTime))).sort();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Dashboard</h1>
      <p className="mt-1.5 text-sm text-muted">Welcome back, {user.fullName}.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <SummaryCard key={stat.label} Icon={stat.Icon} label={stat.label} value={stat.value} href={stat.href} />
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-ink">Appointment calendar</h2>
      <p className="mt-1 text-sm text-muted">Your upcoming and completed appointments.</p>

      {isLoading ? (
        <div className="mt-4 h-96 animate-pulse rounded-2xl bg-surface" />
      ) : (
        <>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <AppCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              countsByDate={countsByDate}
              minDate={historyMin}
              maxDate={futureMax}
            />

            <DayCalendar
              selectedDate={selectedDate}
              times={times}
              appointmentsByTime={appointmentsByTime}
              viewerRole={user.role}
              pickedUpId={null}
              onOpenDetail={(id) => router.push(`/appointments/${id}`)}
              onPickUp={() => {}}
              onDragStart={() => {}}
              onDropOnTime={() => {}}
              onClickTime={() => {}}
              canReschedule={false}
              emptyText="No appointments on this day."
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
