"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartPulse, LogOut, User } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
            <HeartPulse className="h-5 w-5 text-on-brand" />
          </span>
          <span className="text-lg font-bold text-ink">Schedula</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/doctors"
            className="hidden px-3 py-2 text-sm font-semibold text-ink hover:text-brand sm:block"
          >
            Doctors
          </Link>

          {/* Nothing is shown until we know who is logged in, so the buttons do not flash. */}
          {isLoading ? null : user ? (
            <>
              <Link
                href="/appointments"
                className="hidden px-3 py-2 text-sm font-semibold text-ink hover:text-brand sm:block"
              >
                Appointments
              </Link>

              {/* On a small screen only the icon is shown, so the header stays short. */}
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:text-brand"
              >
                <User className="h-4 w-4 shrink-0 text-brand" />
                <span className="hidden max-w-[140px] truncate sm:inline">{user.fullName}</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden px-3 py-2 text-sm font-semibold text-ink hover:text-brand sm:block"
              >
                Login
              </Link>
              <Button href="/signup">
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
