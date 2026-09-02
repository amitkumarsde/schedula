import Link from "next/link";
import Image from "next/image";
import { Star, User, Award, Wallet, Clock } from "lucide-react";
import type { Doctor } from "@/types";

// One doctor card that links to the doctor page.
export default function DoctorCard({ doctor }: { doctor: Doctor }) {
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

            <span className="flex shrink-0 items-center gap-1 text-sm text-muted">
              {doctor.rating}
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            </span>
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
        {doctor.startTime && doctor.endTime && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-brand" />
            {doctor.startTime} - {doctor.endTime}
          </span>
        )}
      </div>
    </Link>
  );
}
