"use client";

import { useEffect, useState } from "react";
import { getDoctorById } from "@/features/doctors/api/doctorService";
import type { Doctor } from "@/types";

// Loads one doctor by id and tracks loading and error state.
export function useDoctor(doctorId: string) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!doctorId) return;
    let isCurrentRequest = true;

    // Fetches the doctor from the API.
    async function loadDoctor() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const result = await getDoctorById(doctorId);
        if (isCurrentRequest) setDoctor(result);
      } catch (error) {
        if (isCurrentRequest) {
          setErrorMessage(error instanceof Error ? error.message : "Could not load the doctor");
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    loadDoctor();

    return () => {
      isCurrentRequest = false;
    };
  }, [doctorId]);

  return { doctor, isLoading, errorMessage };
}
