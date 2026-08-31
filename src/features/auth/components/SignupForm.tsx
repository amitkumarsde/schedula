"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Stethoscope } from "lucide-react";
import FormInput from "@/components/ui/FormInput";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { signupUser } from "@/features/auth/api/authService";
import { useAuth } from "@/lib/auth/AuthContext";
import type { UserRole } from "@/types";

const ROLE_OPTIONS = [
  { value: "patient" as UserRole, label: "I am a Patient", Icon: User },
  { value: "doctor" as UserRole, label: "I am a Doctor", Icon: Stethoscope },
];

// The same email check the API uses, so both agree on what is valid.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The signup form for a patient or a doctor.
export default function SignupForm() {
  const [role, setRole] = useState<UserRole>("patient");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim();

    // Checked here too, so the user sees the problem without waiting for the server.
    if (cleanFullName.length < 3 || cleanFullName.length > 60) {
      setErrorMessage("Full name must be between 3 and 60 characters");
      return;
    }

    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (password.length < 4) {
      setErrorMessage("Password must be at least 4 characters");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Both passwords must be the same");
      return;
    }

    setIsSaving(true);

    try {
      const user = await signupUser(cleanFullName, cleanEmail, password, role);
      login(user);
      router.push("/doctors");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not create the account");
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <div className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h1 className="text-center text-2xl font-bold text-ink">Create account</h1>
        <p className="mt-1.5 text-center text-sm text-muted">It takes less than a minute</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errorMessage && <Alert message={errorMessage} />}

          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">I want to join as</p>

            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((option) => {
                const isSelected = role === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors ${
                      isSelected
                        ? "border-brand bg-brand-soft text-brand"
                        : "border-line bg-card text-muted hover:border-brand"
                    }`}
                  >
                    <option.Icon className="h-6 w-6" />
                    <span className="text-sm font-semibold">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <FormInput
            label="Full name"
            name="fullName"
            value={fullName}
            onChange={setFullName}
            placeholder="Enter your full name"
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            hint="This is what you will log in with."
          />

          <div className="relative">
            <FormInput
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Create a password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-9 cursor-pointer text-muted hover:text-brand"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <FormInput
            label="Confirm password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Type the password again"
          />

          <div className="pt-2">
            <Button type="submit" fullWidth disabled={isSaving}>
              {isSaving ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
