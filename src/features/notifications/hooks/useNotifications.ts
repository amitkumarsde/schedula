"use client";

import { useEffect, useState } from "react";
import { getNotifications } from "@/features/notifications/api/notificationService";
import type { Notification } from "@/types";

// Loads the user's notifications and keeps the unread count.
export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let isCurrentRequest = true;

    // Fetches the notifications from the API.
    async function loadNotifications() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const result = await getNotifications(userId);
        if (isCurrentRequest) {
          setNotifications(result.notifications);
          setUnreadCount(result.unreadCount);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setErrorMessage(error instanceof Error ? error.message : "Could not load notifications");
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    loadNotifications();

    return () => {
      isCurrentRequest = false;
    };
  }, [userId, reloadCount]);

  // Loads the notifications again.
  function reloadNotifications() {
    setReloadCount((current) => current + 1);
  }

  return { notifications, unreadCount, isLoading, errorMessage, reloadNotifications };
}
