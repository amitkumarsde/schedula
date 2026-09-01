import { UserSearch, CalendarClock, CircleCheckBig } from "lucide-react";

const STEPS = [
  {
    Icon: UserSearch,
    title: "Find a doctor",
    text: "Search by name, specialization or city and open the doctor you like.",
  },
  {
    Icon: CalendarClock,
    title: "Pick a free slot",
    text: "Choose a date and a time slot. Slots already booked are shown as unavailable.",
  },
  {
    Icon: CircleCheckBig,
    title: "Get confirmation",
    text: "Complete your profile once and your appointment number is confirmed instantly.",
  },
];

// The three steps section on the home page.
export default function HowItWorks() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">How it works</h2>
        <p className="mt-2 text-center text-muted">Three simple steps</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-line bg-card p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
                <step.Icon className="h-6 w-6 text-brand" />
              </span>

              <h3 className="mt-4 font-bold text-ink">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
