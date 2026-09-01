"use client";

import { useState } from "react";

// Holds the edit and save state shared by every profile tab.
export function useEditableSection(onSaved: () => void) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Runs a save action and shows the error or closes the editor.
  async function runSave(action: () => Promise<void>) {
    setErrorMessage("");
    setIsSaving(true);

    try {
      await action();
      onSaved();
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not save");
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isEditing,
    isSaving,
    errorMessage,
    openEditor: () => setIsEditing(true),
    closeEditor: () => setIsEditing(false),
    runSave,
  };
}
