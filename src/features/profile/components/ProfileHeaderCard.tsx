import Link from "next/link";
import { Mail, Pencil } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

type ProfileHeaderCardProps = {
  fullName: string;
  subtitle: string;
  email: string;
  imageUrl: string;
  editHref?: string;
};

// The photo, name and email shown at the top of the profile.
export default function ProfileHeaderCard({
  fullName,
  subtitle,
  email,
  imageUrl,
  editHref,
}: ProfileHeaderCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 border-b border-line pb-6 sm:flex-row sm:items-center">
      <Avatar imageUrl={imageUrl} fullName={fullName} size={96} />

      <div className="min-w-0 flex-1 text-center sm:text-left">
        {/* The edit icon sits to the right of the name and opens the edit page. */}
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <h1 className="truncate text-2xl font-bold text-ink">{fullName}</h1>

          {editHref && (
            <Link
              href={editHref}
              aria-label="Edit profile"
              className="shrink-0 text-muted transition-colors hover:text-brand"
            >
              <Pencil className="h-4 w-4" />
            </Link>
          )}
        </div>

        <span className="mt-1 inline-block rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">
          {subtitle}
        </span>

        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted sm:justify-start">
          <Mail className="h-4 w-4 shrink-0" />
          <span className="truncate">{email}</span>
        </p>
      </div>
    </div>
  );
}
