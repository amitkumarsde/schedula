import Link from "next/link";
import { HeartPulse, Mail, Phone, MapPin } from "lucide-react";
import SocialLinks from "@/components/layout/SocialLinks";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find a Doctor", href: "/doctors" },
  { label: "Sign Up", href: "/signup" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/" },
  { label: "Refund Policy", href: "/" },
  { label: "Terms & Conditions", href: "/" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="lg:pr-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
                <HeartPulse className="h-5 w-5 text-on-brand" />
              </span>
              <span className="text-lg font-bold text-ink">Schedula</span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              Find the right doctor, check their free time slots, and book your appointment online in just a few minutes.
            </p>

            <div className="mt-5">
              <SocialLinks />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink">Contact Us</h3>
            <ul className="mt-4 space-y-4 text-sm text-muted">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>2nd Floor, Schedula House, Dwarka - Delhi, 110075</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <a href="tel:+911234567890" className="hover:text-brand">
                  +91 12345 67890
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <a href="mailto:support@schedula.com" className="hover:text-brand">
                  support@schedula.com
                </a>
              </li>
            </ul>

            <p className="mt-5 text-xs leading-relaxed text-muted">
              Support hours: Monday to Saturday, 9:00 AM to 8:00 PM
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-muted hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Schedula. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
