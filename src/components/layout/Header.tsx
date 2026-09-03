"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartPulse, LogOut, User, Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import { clearChatHistory } from "@/features/chatbot/api/chatService";
import { useAuth } from "@/lib/auth/AuthContext";
import { toast } from "react-toastify";

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    setIsMenuOpen(false);
    // Delete the saved chat so nothing is kept after logout.
    if (user) clearChatHistory(user._id).catch(() => {});
    logout();
    router.push("/");
    toast.success("Logged out successfully");
  }

  // The page links shown in the navbar, based on who is logged in.
  const navLinks = user
    ? [
        { href: "/doctors", label: "Doctors" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/appointments", label: "Appointments" },
      ]
    : [
        { href: "/doctors", label: "Doctors" },
        { href: "/login", label: "Login" },
      ];

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
            <HeartPulse className="h-5 w-5 text-on-brand" />
          </span>
          <span className="text-lg font-bold text-ink">Schedula</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Page links, shown inline on desktop only. */}
          {!isLoading &&
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hidden px-3 py-2 text-sm font-semibold text-ink hover:text-brand sm:block"
              >
                {link.label}
              </Link>
            ))}

          {isLoading ? null : user ? (
            <>
              <NotificationBell userId={user._id} />

              <Link
                href="/profile"
                aria-label="Profile"
                className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-brand"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Logout stays inline on desktop; on mobile it moves into the menu. */}
              <button
                type="button"
                aria-label="Logout"
                onClick={handleLogout}
                className="hidden h-10 w-10 cursor-pointer items-center justify-center text-ink transition-colors hover:text-danger sm:flex"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Button href="/signup">Sign Up</Button>
          )}

          {/* Hamburger, shown on mobile only. */}
          {!isLoading && (
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center text-ink hover:text-brand sm:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* The dropdown menu for mobile screens. */}
      {isMenuOpen && !isLoading && (
        <div className="border-t border-line bg-card sm:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-2 py-3 text-sm font-semibold text-ink hover:text-brand"
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-3 text-left text-sm font-semibold text-ink hover:text-danger"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
