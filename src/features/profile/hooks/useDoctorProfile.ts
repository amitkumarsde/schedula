"use client";

import { useEffect, useState } from "react";
import { getDoctorProfile } from "@/features/profile/api/doctorProfileService";
import type { Doctor } from "@/types";

// Loads the logged in doctor's profile.
export function useDoctorProfile(userId: string) {
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let isCurrentRequest = true;

    // Fetches the profile from the API.
    async function loadProfile() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const profile = await getDoctorProfile(userId);
        if (isCurrentRequest) setDoctorProfile(profile);
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

  // Loads the profile again after a save.
  function reloadProfile() {
    setReloadCount((current) => current + 1);
  }

  return { doctorProfile, isLoading, errorMessage, reloadProfile };
}
