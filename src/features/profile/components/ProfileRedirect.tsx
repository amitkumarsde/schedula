"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

// Sends the logged in user to their own role's profile page.
export default function ProfileRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/login");
    else router.replace(`/profile/${user.role}`);
  }, [isLoading, user, router]);

  return null;
}
