import { CircleAlert } from "lucide-react";

// Shows one short error message above a form.
export default function Alert({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
