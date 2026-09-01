"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CalendarCheck, ShieldCheck, Clock } from "lucide-react";
import Button from "@/components/ui/Button";

// The top section of the home page.
export default function HeroSection() {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  // Opens the doctors page with the typed search.
  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const cleanText = searchText.trim();
    router.push(cleanText ? `/doctors?search=${encodeURIComponent(cleanText)}` : "/doctors");
  }

  return (
    <section className="bg-brand-soft">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm font-medium text-brand">
          <CalendarCheck className="h-4 w-4" />
          Book in under a minute
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Find the right doctor and book your appointment
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
          Search by doctor, specialization or city. Pick a free time slot and get an instant confirmation.
        </p>

        <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-line bg-card px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-muted" />
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search doctors, specialization or city"
              className="w-full text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>

          <Button type="submit">Search</Button>
        </form>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand" />
            Verified doctors
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand" />
            Real time slots
          </span>
          <span className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-brand" />
            Free cancellation
          </span>
        </div>
      </div>
    </section>
  );
}
