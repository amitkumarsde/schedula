"use client";

import { useState } from "react";

// Holds the saving state for one profile form on the edit page.
export function useSaveForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedOk, setSavedOk] = useState(false);

  // Runs a save action and shows the error or a "Saved" message.
  async function runSave(action: () => Promise<void>) {
    setErrorMessage("");
    setSavedOk(false);
    setIsSaving(true);

    try {
      await action();
      setSavedOk(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not save");
    } finally {
      setIsSaving(false);
    }
  }

  return { isSaving, errorMessage, savedOk, runSave };
}
