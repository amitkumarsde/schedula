"use client";

import { useEffect, useState } from "react";
import { getDoctorSlots } from "@/features/appointments/api/appointmentService";
import type { Slot } from "@/types";

// Loads the slots for one doctor on a date.
export function useDoctorSlots(doctorId: string, date: string) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isWorkingDay, setIsWorkingDay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!doctorId || !date) return;
    let isCurrentRequest = true;

    // Fetches the slots from the API.
    async function loadSlots() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const result = await getDoctorSlots(doctorId, date);
        if (isCurrentRequest) {
          setSlots(result.slots);
          setIsWorkingDay(result.isWorkingDay);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setErrorMessage(error instanceof Error ? error.message : "Could not load the slots");
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    loadSlots();

    return () => {
      isCurrentRequest = false;
    };
  }, [doctorId, date]);

  return { slots, isWorkingDay, isLoading, errorMessage };
}
