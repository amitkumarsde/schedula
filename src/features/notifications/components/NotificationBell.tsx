"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";

// The header bell icon with a small unread count badge.
export default function NotificationBell({ userId }: { userId: string }) {
  const { unreadCount, reloadNotifications } = useNotifications(userId);
  const pathname = usePathname();

  // Refresh the count when the page changes, for example after reading them.
  useEffect(() => {
    reloadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Link
      href="/notifications"
      aria-label="Notifications"
      className="relative flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-brand"
    >
      <Bell className="h-5 w-5" />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs font-semibold text-on-brand">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
