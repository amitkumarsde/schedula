"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, BellOff } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/lib/auth/AuthContext";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { markNotificationsRead } from "@/features/notifications/api/notificationService";
import type { Notification } from "@/types";

// Shows a timestamp like "1 Sep 2026, 10:30 am".
function formatTime(isoDate: string) {
  return new Date(isoDate).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// One notification row, separated from the next by a line (no box).
function NotificationRow({ notification }: { notification: Notification }) {
  // The row classes go on the outer element so the divider line shows correctly.
  const rowClass = "flex items-start gap-3 rounded-lg px-2 py-4 transition-colors hover:bg-surface";

  const inner = (
    <>
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft">
        <Bell className="h-4 w-4 text-brand" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink">{notification.message}</p>
        <p className="mt-1 text-xs text-muted">{formatTime(notification.createdAt)}</p>
      </div>

      {/* A small dot marks a notification that has not been read yet. */}
      {!notification.isRead && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />}
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Notifications</h1>
      <p className="mt-1.5 text-sm text-muted">Updates about your appointments.</p>

      <div className="mt-6">
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
          <div className="divide-y divide-line">
            {notifications.map((notification) => (
              <NotificationRow key={notification._id} notification={notification} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
