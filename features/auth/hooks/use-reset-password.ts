import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useResetPassword(token: string) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await fetch(`/api/auth/validate-token?token=${token}`);
        const data = await res.json();
        if (data.valid) setIsValidToken(true);
        else setError("Invalid or expired password reset link. Please request a new one.");
      } catch {
        setError("Failed to validate reset link. Please try again.");
      } finally {
        setValidating(false);
      }
    };
    validate();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters long"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return {
    password, setPassword, confirmPassword, setConfirmPassword,
    message, error, loading, validating, isValidToken,
    handleSubmit, router,
  };
}
