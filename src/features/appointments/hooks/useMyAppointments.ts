"use client";

import { useEffect, useState } from "react";
import { getMyAppointments } from "@/features/appointments/api/appointmentService";
import type { Appointment } from "@/types";

// Loads the logged in user's appointments.
export function useMyAppointments(userId: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let isCurrentRequest = true;

    // Fetches the appointments from the API.
    async function loadAppointments() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const result = await getMyAppointments(userId);
        if (isCurrentRequest) setAppointments(result);
      } catch (error) {
        if (isCurrentRequest) {
          setErrorMessage(error instanceof Error ? error.message : "Could not load appointments");
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    loadAppointments();

    return () => {
      isCurrentRequest = false;
    };
  }, [userId, reloadCount]);

  // Loads the appointments again.
  function reloadAppointments() {
    setReloadCount((current) => current + 1);
  }

  return { appointments, isLoading, errorMessage, reloadAppointments };
}
