"use client";

import { useState } from "react";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

// Holds the saving state for one profile form on the edit page.
export function useSaveForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedOk, setSavedOk] = useState(false);

  // Runs a save action; calls onSuccess only when the save works.
  async function runSave(action: () => Promise<void>, onSuccess?: () => void) {
    setErrorMessage("");
    setSavedOk(false);
    setIsSaving(true);

    try {
      await action();
      setSavedOk(true);
      onSuccess?.();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Could not save"));
    } finally {
      setIsSaving(false);
    }
  }

  return { isSaving, errorMessage, savedOk, runSave };
}
