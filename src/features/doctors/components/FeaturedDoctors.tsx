"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDoctors } from "@/features/doctors/hooks/useDoctors";
import DoctorCard from "@/features/doctors/components/DoctorCard";
import DoctorListSkeleton from "@/features/doctors/components/DoctorListSkeleton";

const HOW_MANY_TO_SHOW = 6;

// Shows the top doctors on the home page.
export default function FeaturedDoctors() {
  const { doctors, isLoading, errorMessage } = useDoctors();

  // The API already sorts by rating, so the first ones are the top rated.
  const topDoctors = doctors.slice(0, HOW_MANY_TO_SHOW);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Top rated doctors</h2>
          <p className="mt-2 text-muted">Available for appointments right now</p>
        </div>

        <Link href="/doctors" className="flex items-center gap-1 hover:text-brand">
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8">
        {isLoading && <DoctorListSkeleton count={HOW_MANY_TO_SHOW} />}

        {!isLoading && errorMessage && (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center text-muted">
            {errorMessage}
          </p>
        )}

        {!isLoading && !errorMessage && topDoctors.length === 0 && (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center text-muted">
            No doctors are available yet.
          </p>
        )}

        {!isLoading && topDoctors.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
