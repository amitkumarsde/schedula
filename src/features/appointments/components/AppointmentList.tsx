"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarX } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMyAppointments } from "@/features/appointments/hooks/useMyAppointments";
import AppointmentCard from "@/features/appointments/components/AppointmentCard";
import { groupByDate } from "@/lib/utils/groupByDate";
import { formatLongDate } from "@/lib/utils/schedule";
import type { AppointmentStatus } from "@/types";

// The three tabs, matching the three appointment states.
const TABS: { key: AppointmentStatus; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// The appointments page with a tab for each status.
export default function AppointmentList() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { appointments, isLoading, errorMessage } = useMyAppointments(user?._id ?? "");
  const [activeTab, setActiveTab] = useState<AppointmentStatus>("upcoming");

  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/login");
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || !user) return null;

  const shownAppointments = appointments.filter((appointment) => appointment.status === activeTab);
  const groups = groupByDate(shownAppointments, (appointment) => appointment.appointmentDate, false);
  const isPatient = user.role === "patient";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">My appointments</h1>
      <p className="mt-1.5 text-sm text-muted">All your booked appointments in one place.</p>

      {/* Underline tabs. */}
      <div className="no-scrollbar mt-6 flex gap-6 overflow-x-auto border-b border-line">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`-mb-px shrink-0 cursor-pointer border-b-2 pb-3 text-sm font-semibold transition-colors ${
                isActive ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {isLoading && <div className="h-24 animate-pulse rounded-2xl bg-surface" />}

        {!isLoading && errorMessage && <Alert message={errorMessage} />}

        {!isLoading && !errorMessage && shownAppointments.length === 0 && (
          <div className="rounded-2xl bg-surface p-12 text-center">
            <CalendarX className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-semibold text-ink">No {activeTab} appointments</p>

            {isPatient && activeTab === "upcoming" && (
              <div className="mt-5 flex justify-center">
                <Button href="/doctors">Book appointment</Button>
              </div>
            )}
          </div>
        )}

        {!isLoading && shownAppointments.length > 0 && (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.date}>
                <h2 className="mb-1 text-sm font-semibold text-muted">{formatLongDate(group.date)}</h2>
                <div className="divide-y divide-line">
                  {group.items.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      viewerRole={user.role}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
