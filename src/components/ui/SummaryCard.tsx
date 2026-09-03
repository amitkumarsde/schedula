import type { ComponentType } from "react";
import Link from "next/link";

type SummaryCardProps = {
  Icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  href?: string;
};

export default function SummaryCard({ Icon, label, value, href }: SummaryCardProps) {
  const content = (
    <>
      <span className="text-lg font-bold text-ink">{value}</span>

      <span className="flex gap-2 items-center">
        <Icon className="h-4 w-4 text-brand" />
        <span className="text-xs text-muted">{label}</span>
      </span>
    </>
  );

  const baseClass = "flex flex-col items-center gap-2 rounded-2xl border border-line bg-card p-5 text-center";

  if (href) {
    return (
      <Link href={href} className={`${baseClass} transition-colors hover:border-brand`}>
        {content}
      </Link>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
