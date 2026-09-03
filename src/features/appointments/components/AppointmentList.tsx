"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarX, List, Clock, CheckCircle2, CircleSlash, Ban } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMyAppointments } from "@/features/appointments/hooks/useMyAppointments";
import AppointmentCard from "@/features/appointments/components/AppointmentCard";
import ProfileTabs, { type ProfileTab } from "@/features/profile/components/ProfileTabs";
import { groupByDate } from "@/lib/utils/groupByDate";
import { formatLongDate } from "@/lib/utils/schedule";
import type { AppointmentStatus } from "@/types";

// "all" shows everything; the others match a saved status.
type TabKey = "all" | AppointmentStatus;

const TABS: ProfileTab[] = [
  { key: "all", label: "All", Icon: List },
  { key: "upcoming", label: "Upcoming", Icon: Clock },
  { key: "completed", label: "Completed", Icon: CheckCircle2 },
  { key: "missed", label: "Missed", Icon: CircleSlash },
  { key: "cancelled", label: "Cancelled", Icon: Ban },
];

// The appointments page with a tab for each status.
export default function AppointmentList() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { appointments, isLoading, errorMessage } = useMyAppointments(user?._id ?? "");

  // A "?status=completed" link (for example from the dashboard) opens that tab first.
  const statusFromUrl = searchParams.get("status");
  const initialTab = TABS.some((tab) => tab.key === statusFromUrl) ? (statusFromUrl as TabKey) : "all";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/login");
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || !user) return null;

  // "all" keeps every appointment; any other tab keeps only that status.
  const shownAppointments = appointments.filter(
    (appointment) => activeTab === "all" || appointment.status === activeTab
  );
  // Newest appointment dates first.
  const groups = groupByDate(shownAppointments, (appointment) => appointment.appointmentDate, true);
  const isPatient = user.role === "patient";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">My appointments</h1>
      <p className="mt-1.5 text-sm text-muted">All your booked appointments in one place.</p>

      <div className="mt-6">
        <ProfileTabs tabs={TABS} activeKey={activeTab} onSelect={(key) => setActiveTab(key as TabKey)} />
      </div>

      <div className="mt-6">
        {isLoading && <div className="h-24 animate-pulse rounded-2xl bg-surface" />}

        {!isLoading && errorMessage && <Alert message={errorMessage} />}

        {!isLoading && !errorMessage && shownAppointments.length === 0 && (
          <div className="rounded-2xl bg-surface p-12 text-center">
            <CalendarX className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-semibold text-ink">
              {activeTab === "all" ? "No appointments yet" : `No ${activeTab} appointments`}
            </p>

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
                      showStatus={activeTab === "all"}
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
