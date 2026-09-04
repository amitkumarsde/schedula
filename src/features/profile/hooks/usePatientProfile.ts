"use client";

import { useEffect, useState } from "react";
import { getPatientProfile } from "@/features/profile/api/patientProfileService";
import type { Patient } from "@/types";

// Loads the logged in patient's own profile.
export function usePatientProfile(userId: string) {
  const [patientProfile, setPatientProfile] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let isCurrentRequest = true;

    // Fetches the patient profile from the API.
    async function loadProfile() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const profile = await getPatientProfile(userId);
        if (isCurrentRequest) setPatientProfile(profile);
      } catch (error) {
        if (isCurrentRequest) {
          setErrorMessage(error instanceof Error ? error.message : "Could not load your profile");
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    loadProfile();

    return () => {
      isCurrentRequest = false;
    };
  }, [userId, reloadCount]);

  // Loads the profile again.
  function reloadProfile() {
    setReloadCount((current) => current + 1);
  }

  return { patientProfile, isLoading, errorMessage, reloadProfile };
}
