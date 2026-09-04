"use client";

import { useEffect, useState } from "react";
import { getDoctors } from "@/features/doctors/api/doctorService";
import type { Doctor } from "@/types";

// Loads the doctors list and tracks loading and error state.
export function useDoctors(search = "", specialization = "") {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Ignores an old reply that arrives after a newer one, so the list never shows stale data.
    let isCurrentRequest = true;

    // Fetches the doctors from the API.
    async function loadDoctors() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const result = await getDoctors(search, specialization);
        if (isCurrentRequest) setDoctors(result);
      } catch (error) {
        if (isCurrentRequest) {
          setDoctors([]);
          setErrorMessage(error instanceof Error ? error.message : "Could not load doctors");
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    loadDoctors();

    return () => {
      isCurrentRequest = false;
    };
  }, [search, specialization]);

  return { doctors, isLoading, errorMessage };
}
