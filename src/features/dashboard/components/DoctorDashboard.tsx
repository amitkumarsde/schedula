"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, CheckCircle2, Users } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMyAppointments } from "@/features/appointments/hooks/useMyAppointments";
import { useDoctorProfile } from "@/features/profile/hooks/useDoctorProfile";
import { rescheduleAppointment } from "@/features/appointments/api/appointmentService";
import MonthCalendar from "@/features/appointments/components/MonthCalendar";
import DayCalendar from "@/features/appointments/components/DayCalendar";
import { makeSlots, weekdayName, toDateText, todayDateText } from "@/lib/utils/schedule";
import type { Appointment } from "@/types";

// The short label for one month, like "Sep 2026".
function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// The colour key shown under the calendar.
const LEGEND = [
  { label: "Upcoming", dotClass: "bg-brand" },
  { label: "Completed", dotClass: "bg-success" },
  { label: "Cancelled", dotClass: "bg-muted" },
];

// The doctor's home: stats on top, then the appointment calendar with reschedule.
export default function DoctorDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { appointments, isLoading, reloadAppointments } = useMyAppointments(user?._id ?? "");
  const { doctorProfile } = useDoctorProfile(user?._id ?? "");

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayDateText());

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [pickedUpId, setPickedUpId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // The dashboard is only for doctors, so send anyone else away.
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

  // The switcher shows this month and the next two only (no going back).
  const monthTabs = [0, 1, 2].map((offset) => {
    const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return { year: date.getFullYear(), month: date.getMonth() };
  });

  // Moves one appointment to the selected day and the chosen time.
  async function reschedule(appointmentId: string | null, time: string) {
    if (!appointmentId || !user) return;

    setMessage("");
    setErrorMessage("");

    try {
      await rescheduleAppointment(appointmentId, user._id, selectedDate, time);
      setMessage("Appointment rescheduled. The patient has been notified.");
      reloadAppointments();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not reschedule");
    } finally {
      setDraggedId(null);
      setPickedUpId(null);
    }
  }

  // Switches the month shown, and starts the day view on the 1st of that month.
  function selectMonth(year: number, month: number) {
    setViewYear(year);
    setViewMonth(month);
    setSelectedDate(toDateText(year, month, 1));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Dashboard</h1>
      <p className="mt-1.5 text-sm text-muted">Welcome back, {user.fullName}.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-surface p-4">
            <stat.Icon className="h-5 w-5 text-brand" />
            <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-ink">Appointment calendar</h2>
      <p className="mt-1 text-sm text-muted">
        Drag an upcoming appointment to a free slot, or tap its move icon then pick any month, day and free slot, to reschedule.
      </p>

      <div className="mt-4 space-y-3">
        {message && <p className="rounded-xl bg-success-soft px-4 py-3 text-sm font-medium text-success">{message}</p>}
        {errorMessage && <Alert message={errorMessage} />}
      </div>

      {isLoading ? (
        <div className="mt-4 h-96 animate-pulse rounded-2xl bg-surface" />
      ) : (
        <>
          {/* Month switcher, centered above both calendars. */}
          <div className="mx-auto mt-4 grid grid-cols-3 gap-1 rounded-xl border border-line bg-surface p-1 sm:max-w-sm">
            {monthTabs.map((tab) => {
              const isActive = tab.year === viewYear && tab.month === viewMonth;

              return (
                <button
                  key={`${tab.year}-${tab.month}`}
                  type="button"
                  onClick={() => selectMonth(tab.year, tab.month)}
                  className={`rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-card text-brand shadow-sm" : "text-muted hover:text-ink"
                  }`}
                >
                  {monthLabel(tab.year, tab.month)}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <MonthCalendar
              year={viewYear}
              month={viewMonth}
              selectedDate={selectedDate}
              countsByDate={countsByDate}
              onSelectDate={setSelectedDate}
              availableDays={doctorProfile?.availableDays}
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
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-4">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-2 text-sm text-muted">
            <span className={`h-3 w-3 rounded-full ${item.dotClass}`} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
