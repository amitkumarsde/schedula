"use client";

import { useEffect, useState } from "react";
import { getAppointment } from "@/features/appointments/api/appointmentService";
import type { Appointment } from "@/types";

// Loads one appointment and lets the page reload it.
export function useAppointment(appointmentId: string, userId: string) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (!appointmentId || !userId) return;
    let isCurrentRequest = true;

    // Fetches the appointment from the API.
    async function loadAppointment() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const result = await getAppointment(appointmentId, userId);
        if (isCurrentRequest) setAppointment(result);
      } catch (error) {
        if (isCurrentRequest) {
          setErrorMessage(error instanceof Error ? error.message : "Could not load the appointment");
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    loadAppointment();

    return () => {
      isCurrentRequest = false;
    };
  }, [appointmentId, userId, reloadCount]);

  // Loads the appointment again.
  function reloadAppointment() {
    setReloadCount((current) => current + 1);
  }

  return { appointment, isLoading, errorMessage, reloadAppointment };
}
