import Button from "@/components/ui/Button";

// The Save button plus a small "Saved" message for one profile form.
export default function SaveButton({ isSaving, savedOk }: { isSaving: boolean; savedOk: boolean }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {savedOk && <span className="text-sm font-medium text-success">Saved.</span>}

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
