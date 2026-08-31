import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "outline";
  fullWidth?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
};

const STYLE_BY_VARIANT = {
  primary: "bg-brand text-on-brand hover:bg-brand-dark",
  outline: "border border-brand text-brand bg-card hover:bg-brand-soft",
};

export default function Button({
  children,
  href,
  variant = "primary",
  fullWidth = false,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const styles = [
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3",
    "text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer",
    STYLE_BY_VARIANT[variant],
    fullWidth ? "w-full" : "",
    disabled ? "cursor-not-allowed opacity-60" : "",
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}
