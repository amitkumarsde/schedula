"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import FormInput from "@/components/ui/FormInput";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { loginUser } from "@/features/auth/api/authService";
import { useAuth } from "@/lib/auth/AuthContext";

// The login form, with the email and password.
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your email and password");
      return;
    }

    // isSaving disables the button, so a double click cannot send two requests.
    setIsSaving(true);

    try {
      const user = await loginUser(email.trim(), password);
      login(user);
      router.push("/doctors");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not log in");
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <div className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h1 className="text-center text-2xl font-bold text-ink">Login</h1>
        <p className="mt-1.5 text-center text-sm text-muted">Welcome back, please enter your details</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errorMessage && <Alert message={errorMessage} />}

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
          />

          <div className="relative">
            <FormInput
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
            />

            {/* Sits on top of the input so the user can check what they typed. */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-9 cursor-pointer text-muted hover:text-brand"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth disabled={isSaving}>
              {isSaving ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-brand hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
