"use client";

import { useState } from "react";
import { ExternalLink, Trash2, Plus } from "lucide-react";
import FormInput from "@/components/ui/FormInput";
import Alert from "@/components/ui/Alert";
import EditableCard from "@/features/profile/components/EditableCard";
import EditActions from "@/features/profile/components/EditActions";
import { useEditableSection } from "@/features/profile/hooks/useEditableSection";
import { savePatientProfileSection } from "@/features/profile/api/patientProfileService";
import type { FileLink } from "@/types";

type FileLinksSectionProps = {
  title: string;
  emptyText: string;
  links: FileLink[];
  userId: string;
  section: "documents" | "reports";
  onSaved: () => void;
};

// A file is saved as a link, because the project has no file storage yet.
export default function FileLinksSection({
  title,
  emptyText,
  links,
  userId,
  section,
  onSaved,
}: FileLinksSectionProps) {
  const editor = useEditableSection(onSaved);
  const [draftLinks, setDraftLinks] = useState<FileLink[]>(links);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [addError, setAddError] = useState("");

  // Adds the typed link to the list, after a light check.
  function addLink() {
    if (!newName.trim() || !newUrl.trim()) {
      setAddError("Please fill both the name and the link");
      return;
    }
    if (!newUrl.trim().startsWith("https://")) {
      setAddError("The link must start with https://");
      return;
    }

    setAddError("");
    setDraftLinks([...draftLinks, { name: newName.trim(), url: newUrl.trim() }]);
    setNewName("");
    setNewUrl("");
  }

  // Removes one link by its position in the list.
  function removeLink(indexToRemove: number) {
    setDraftLinks(draftLinks.filter((_, index) => index !== indexToRemove));
  }

  // Sends the form to the API when submitted.
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    editor.runSave(async () => {
      await savePatientProfileSection(userId, section, { links: draftLinks });
    });
  }

  if (!editor.isEditing) {
    return (
      <EditableCard title={title} onEdit={editor.openEditor}>
        {links.length === 0 ? (
          <p className="text-sm text-muted">{emptyText}</p>
        ) : (
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3"
              >
                <span className="truncate text-sm font-medium text-ink">{link.name}</span>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                >
                  Open
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </EditableCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-card p-6">
      <h3 className="font-bold text-ink">Edit {title.toLowerCase()}</h3>

      {editor.errorMessage && <Alert message={editor.errorMessage} />}

      {draftLinks.length === 0 ? (
        <p className="text-sm text-muted">No links yet. Add one below.</p>
      ) : (
        <ul className="space-y-2">
          {draftLinks.map((link, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3"
            >
              <span className="truncate text-sm font-medium text-ink">{link.name}</span>

              <button
                type="button"
                onClick={() => removeLink(index)}
                aria-label="Remove link"
                className="shrink-0 cursor-pointer text-muted hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-3 border-t border-line pt-4">
        {addError && <Alert message={addError} />}

        <div className="grid gap-3 sm:grid-cols-2">
          <FormInput
            label="Name"
            name="linkName"
            value={newName}
            onChange={setNewName}
            placeholder="Blood test report"
          />

          <FormInput
            label="Link"
            name="linkUrl"
            value={newUrl}
            onChange={setNewUrl}
            placeholder="https://example.com/file.pdf"
          />
        </div>

        <button
          type="button"
          onClick={addLink}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-brand px-4 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
        >
          <Plus className="h-4 w-4" />
          Add to list
        </button>
      </div>

      <div className="border-t border-line pt-4">
        <EditActions isSaving={editor.isSaving} onCancel={editor.closeEditor} />
      </div>
    </form>
  );
}
