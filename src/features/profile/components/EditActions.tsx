import Button from "@/components/ui/Button";

// The Save and Cancel buttons for an edit form.
export default function EditActions({
  isSaving,
  onCancel,
}: {
  isSaving: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
      <Button type="submit" disabled={isSaving} fullWidth>
        {isSaving ? "Saving..." : "Save"}
      </Button>

      <Button variant="outline" onClick={onCancel} fullWidth>
        Cancel
      </Button>
    </div>
  );
}
