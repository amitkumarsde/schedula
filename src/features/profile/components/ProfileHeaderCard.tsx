import { Mail } from "lucide-react";
import ProfileAvatar from "@/features/profile/components/ProfileAvatar";

type ProfileHeaderCardProps = {
  fullName: string;
  subtitle: string;
  email: string;
  imageUrl: string;
};

// The photo, name and email card at the top of the profile.
export default function ProfileHeaderCard({
  fullName,
  subtitle,
  email,
  imageUrl,
}: ProfileHeaderCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="h-24 bg-brand-soft" />

      <div className="flex flex-col items-center gap-4 px-6 pb-6 sm:flex-row sm:items-end">
        {/* The photo sits over the band, with a white ring around it. */}
        <div className="-mt-14 rounded-2xl ring-4 ring-card">
          <ProfileAvatar imageUrl={imageUrl} fullName={fullName} size={112} />
        </div>

        <div className="min-w-0 flex-1 text-center sm:pb-1 sm:text-left">
          <h1 className="truncate text-2xl font-bold text-ink">{fullName}</h1>

          <span className="mt-1 inline-block rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">
            {subtitle}
          </span>

          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted sm:justify-start">
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate">{email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
