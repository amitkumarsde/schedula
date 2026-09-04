import Link from "next/link";
import Image from "next/image";
import { Star, User, Award, Wallet, Clock, Heart } from "lucide-react";
import type { Doctor } from "@/types";

// One doctor card that links to the doctor page. Shows a save heart when onToggleSave is given.
export default function DoctorCard({
  doctor,
  isSaved = false,
  onToggleSave,
}: {
  doctor: Doctor;
  isSaved?: boolean;
  onToggleSave?: (doctorId: string) => void;
}) {
  return (
    <Link
      href={`/doctors/${doctor._id}`}
      className="rounded-2xl border border-line bg-card p-4 transition-colors hover:border-brand"
    >
      <div className="flex gap-4">
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

            <div className="flex shrink-0 items-center gap-2">
              <span className="flex items-center gap-1 text-sm text-muted">
                {doctor.rating}
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              </span>

              {/* The save heart. preventDefault stops the click from opening the card. */}
              {onToggleSave && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onToggleSave(doctor._id);
                  }}
                  aria-label={isSaved ? "Remove from saved" : "Save doctor"}
                  className="cursor-pointer text-muted transition-colors hover:text-danger"
                >
                  <Heart className={`h-5 w-5 ${isSaved ? "fill-danger text-danger opacity-80" : ""}`} />
                </button>
              )}
            </div>
          </div>

          <p className="mt-0.5 text-sm font-medium text-brand">{doctor.specialization}</p>

          <p className="mt-1.5 line-clamp-2 text-sm text-muted">{doctor.about}</p>

        </div>

      </div>

      <div className="mt-2.5 flex flex-wrap justify-between items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <Award className="h-4 w-4 text-brand" />
          {doctor.experienceYears} yrs
        </span>
        <span className="flex items-center gap-1.5">
          <Wallet className="h-4 w-4 text-brand" />
          Rs {doctor.consultationFee}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-brand" />
          {doctor.slotDuration} min.
        </span>
      </div>
    </Link>
  );
}
