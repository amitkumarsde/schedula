"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellOff, ChevronRight } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/lib/auth/AuthContext";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { markNotificationsRead } from "@/features/notifications/api/notificationService";
import { groupByDate } from "@/lib/utils/groupByDate";
import { toDateText, formatLongDate } from "@/lib/utils/schedule";
import type { Notification } from "@/types";

// The "2026-09-01" day of a notification, used to group them.
function dayKey(isoDate: string) {
  const d = new Date(isoDate);
  return toDateText(d.getFullYear(), d.getMonth(), d.getDate());
}

// Shows a time like "10:30 AM".
function formatTime(isoDate: string) {
  return new Date(isoDate).toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
}

// One notification row.
function NotificationRow({ notification }: { notification: Notification }) {
  const rowClass = `flex items-start gap-3 rounded-xl px-4 py-4 transition-colors hover:bg-surface ${
    notification.isRead ? "" : "bg-brand-soft/40"
  }`;

  const inner = (
    <>
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.isRead ? "bg-line" : "bg-brand"}`}
      />

      <div className="min-w-0 flex-1">
        <p className={`text-sm ${notification.isRead ? "text-ink" : "font-medium text-ink"}`}>
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-muted">{formatTime(notification.createdAt)}</p>
      </div>

      {notification.appointmentId && (
        <ChevronRight className="h-5 w-5 shrink-0 self-center text-muted" />
      )}
    </>
  );

  if (notification.appointmentId) {
    return (
      <Link href={`/appointments/${notification.appointmentId}`} className={rowClass}>
        {inner}
      </Link>
    );
  }
  return <div className={rowClass}>{inner}</div>;
}

// The notifications page.
export default function NotificationList() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { notifications, isLoading, errorMessage } = useNotifications(user?._id ?? "");
  const hasMarkedRead = useRef(false);

  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/login");
  }, [isAuthLoading, user, router]);

  // Opening the page marks everything read, so the bell count clears.
  useEffect(() => {
    if (user && !hasMarkedRead.current) {
      hasMarkedRead.current = true;
      markNotificationsRead(user._id).catch(() => {});
    }
  }, [user]);

  if (isAuthLoading || !user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Notifications</h1>
      <p className="mt-1.5 text-sm text-muted">Updates about your appointments.</p>

      <div className="mt-8">
        {isLoading && <div className="h-24 animate-pulse rounded-2xl bg-surface" />}

        {!isLoading && errorMessage && <Alert message={errorMessage} />}

        {!isLoading && !errorMessage && notifications.length === 0 && (
          <div className="rounded-2xl border border-line bg-surface p-12 text-center">
            <BellOff className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-semibold text-ink">No notifications yet</p>
            <p className="mt-1 text-sm text-muted">You will see appointment updates here.</p>
          </div>
        )}

        {!isLoading && notifications.length > 0 && (
          <div className="space-y-8">
            {groupByDate(notifications, (one) => dayKey(one.createdAt)).map((group) => (
              <div key={group.date}>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  {formatLongDate(group.date)}
                </h2>
                <div className="space-y-1">
                  {group.items.map((notification) => (
                    <NotificationRow key={notification._id} notification={notification} />
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
