"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";

// Shows the booking call-to-action banner on the home page.
export default function BookingCallToAction() {
  const { user, isLoading } = useAuth();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-3xl bg-brand px-6 py-14 text-center">
        <h2 className="text-2xl font-bold text-on-brand sm:text-3xl">
          Ready to book your appointment?
        </h2>

        <p className="mx-auto mt-3 max-w-md text-on-brand/90">
          Pick a doctor, choose a free time slot, and get your confirmation right away.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {!isLoading && !user && (
            <Button href="/signup" variant="outline">
              Create an account
            </Button>
          )}

          <Button href="/doctors" variant="outline">
            Browse doctors
          </Button>
        </div>
      </div>
    </section>
  );
}
