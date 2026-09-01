"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SearchX } from "lucide-react";
import { useDoctors } from "@/features/doctors/hooks/useDoctors";
import { SPECIALIZATIONS } from "@/lib/utils/specializations";
import DoctorCard from "@/features/doctors/components/DoctorCard";
import DoctorListSkeleton from "@/features/doctors/components/DoctorListSkeleton";
import Alert from "@/components/ui/Alert";

// The doctors page with search and specialization filter.
export default function DoctorsBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The filters live in the URL, so the page can be shared and the back button works.
  const search = searchParams.get("search") ?? "";
  const specialization = searchParams.get("specialization") ?? "";

  const { doctors, isLoading, errorMessage } = useDoctors(search, specialization);

  // Puts the chosen filters into the URL.
  function applyFilters(nextSearch: string, nextSpecialization: string) {
    const query = new URLSearchParams();
    if (nextSearch) query.set("search", nextSearch);
    if (nextSpecialization) query.set("specialization", nextSpecialization);

    const queryText = query.toString();
    router.push(queryText ? `/doctors?${queryText}` : "/doctors");
  }

  // Runs the search when the box is submitted.
  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const typedText = String(new FormData(event.currentTarget).get("search") ?? "");
    applyFilters(typedText.trim(), specialization);
  }

  const hasFilters = Boolean(search || specialization);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Find a Doctor</h1>
      <p className="mt-2 text-muted">Search from our list of doctors.</p>

      <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-line bg-card px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-muted" />
          <input
            // key builds a fresh box on every URL change, so it matches the list.
            key={search}
            name="search"
            type="text"
            defaultValue={search}
            placeholder="Search by doctor name, specialization or city"
            className="w-full text-sm text-ink outline-none placeholder:text-muted"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer rounded-xl bg-brand px-6 py-3 text-sm font-semibold whitespace-nowrap text-on-brand transition-colors hover:bg-brand-dark"
        >
          Search
        </button>
      </form>

      {/* One sliding line of chips. Clicking the selected one again removes the filter. */}
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {SPECIALIZATIONS.map((name) => {
          const isSelected = specialization === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => applyFilters(search, isSelected ? "" : name)}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-card text-muted hover:border-brand hover:text-brand"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {isLoading ? "Loading doctors..." : `${doctors.length} doctor(s) found`}
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push("/doctors")}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            <X className="h-4 w-4" />
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-4">
        {isLoading && <DoctorListSkeleton />}

        {!isLoading && errorMessage && <Alert message={errorMessage} />}

        {!isLoading && !errorMessage && doctors.length === 0 && (
          <div className="rounded-2xl border border-line bg-surface p-12 text-center">
            <SearchX className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-semibold text-ink">No doctors found</p>
            <p className="mt-1 text-sm text-muted">
              Try a different search word or remove the filters.
            </p>
          </div>
        )}

        {!isLoading && doctors.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
