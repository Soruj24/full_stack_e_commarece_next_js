"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InviteLoading, InviteInvalid, InviteForm } from "@/components/auth/invite";

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(!!token);
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      try {
        const res = await fetch(`/api/auth/validate-token?token=${token}&type=invite`);
        const data = await res.json();

        if (res.ok) {
          setIsValid(true);
          setEmail(data.email);
        }
      } catch (error) {
        console.error("Token validation error:", error);
      } finally {
        setVerifying(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (data: { name: string; password: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name: data.name,
          password: data.password,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to accept invitation");
      }

      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return <InviteLoading />;
  }

  if (!isValid) {
    return <InviteInvalid />;
  }

  return <InviteForm email={email} onSubmit={handleSubmit} loading={loading} />;
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  );
}