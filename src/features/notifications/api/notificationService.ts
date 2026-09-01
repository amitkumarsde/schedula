import { apiGet, apiPatch } from "@/lib/api/apiClient";
import type { Notification } from "@/types";

// Loads the logged in user's notifications and the unread count.
export async function getNotifications(
  userId: string
): Promise<{ notifications: Notification[]; unreadCount: number }> {
  const data = await apiGet(`/notifications?userId=${encodeURIComponent(userId)}`);
  return { notifications: data.notifications, unreadCount: data.unreadCount };
}

// Marks all of the user's notifications as read.
export async function markNotificationsRead(userId: string): Promise<void> {
  await apiPatch("/notifications", { userId });
}
