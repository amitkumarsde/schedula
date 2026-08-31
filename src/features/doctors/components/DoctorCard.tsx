import Image from "next/image";
import { Star, User } from "lucide-react";
import type { Doctor } from "@/types";

// One doctor card used on the home page and the doctors page.
export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-line bg-card p-4">
      {doctor.profileImage ? (
        <Image
          src={doctor.profileImage}
          alt={doctor.fullName}
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-xl bg-surface object-contain"
        />
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-surface">
          <User className="h-10 w-10 text-muted" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-lg font-bold text-ink">{doctor.fullName}</h3>

          <span className="flex shrink-0 items-center gap-1 text-sm text-muted">
            <Star className="h-4 w-4 fill-brand text-brand" />
            {doctor.rating}
          </span>
        </div>

        <p className="mt-0.5 text-sm font-medium text-brand">{doctor.specialization}</p>

        <span className="mt-2 inline-block rounded-md bg-success-soft px-2 py-1 text-xs font-medium text-success">
          Available
        </span>

        {/* line-clamp keeps the text to two lines so all cards stay the same height. */}
        <p className="mt-2 line-clamp-2 text-sm text-muted">{doctor.about}</p>
      </div>
    </div>
  );
}
