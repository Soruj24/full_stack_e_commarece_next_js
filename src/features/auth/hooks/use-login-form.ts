"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doCredentialLogin } from "@/lib/actions";

export function useLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await doCredentialLogin(formData);

      if (response?.error) {
        if (response.error.message === "2FA_REQUIRED") {
          setShow2FA(true);
        } else {
          setError(response.error.message || "Login failed");
        }
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (e: unknown) {
      setIsLoading(false);
      if (e instanceof Error && e.message === "2FA_REQUIRED") {
        setShow2FA(true);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }
  }

  return {
    error, showForgot, setShowForgot, show2FA, showPassword, setShowPassword, isLoading, router, onSubmit,
  };
}
