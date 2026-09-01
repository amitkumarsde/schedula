import type { ReactNode } from "react";

// A plain titled card used to show profile details read-only.
export default function ProfileSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-6">
      <h3 className="font-bold text-ink">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}
