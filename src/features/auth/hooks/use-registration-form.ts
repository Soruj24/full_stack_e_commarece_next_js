"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkRegistrationAllowed, registerUser, verifyOTP } from "@/features/auth/services/registration-service";

export function useRegistrationForm() {
  const router = useRouter();
  const [isRegistrationAllowed, setIsRegistrationAllowed] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"register" | "verify">("register");
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkRegistrationAllowed()
      .then(setIsRegistrationAllowed)
      .catch(() => setIsRegistrationAllowed(true));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setOtp("");

    try {
      const form = new FormData(e.currentTarget);
      const name = form.get("name")?.toString().trim();
      const email = form.get("email")?.toString().trim().toLowerCase();
      const password = form.get("password")?.toString();

      if (!name || !email || !password) {
        setError("All fields are required");
        setIsLoading(false);
        return;
      }

      const { ok, data } = await registerUser({ name, email, password, image: "" });

      if (ok && data.email) {
        setUserEmail(data.email);
        setStep("verify");
      } else if (ok) {
        router.push("/login?registered=true");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const { ok, data } = await verifyOTP(userEmail, otp);
      if (ok) {
        router.push("/login?verified=true");
      } else {
        setError(data.error || "Verification failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isRegistrationAllowed,
    error, step,
    userEmail, otp, setOtp,
    isVerifying, isLoading, showPassword, setShowPassword,
    setStep, setError,
    handleSubmit, handleVerifyOTP,
  };
}
