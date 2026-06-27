"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SecurityOverview } from "@/components/security/SecurityOverview";
import { TwoFactorAuth } from "@/components/security/TwoFactorAuth";
import { ChangePasswordForm } from "@/components/security/ChangePasswordForm";
import { DangerZone } from "@/components/security/DangerZone";
import { TwoFactorDialog } from "@/components/security/TwoFactorDialog";

export default function SecuritySettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState<unknown>(null);

  // 2FA state
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [verifying2FA, setVerifying2FA] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setFetching(false);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const handleSetup2FA = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (data.qrCodeUrl) {
        setQrCodeUrl(data.qrCodeUrl);
        setIs2FADialogOpen(true);
      } else {
        toast.error(data.error || "Failed to initiate 2FA setup");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!otpToken || otpToken.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setVerifying2FA(true);
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otpToken }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Two-factor authentication enabled!");
        setIs2FADialogOpen(false);
        setUser({
          ...(user as Record<string, unknown>),
          twoFactorEnabled: true,
        });
        setOtpToken("");
      } else {
        toast.error(data.error || "Invalid verification code");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setVerifying2FA(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="flex flex-col gap-4 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] uppercase tracking-[0.3em] mx-auto">
          Nexus Security Core
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-foreground uppercase italic">
          Identity <span className="text-primary">Shield.</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
          Configure advanced authorization protocols and maintain your digital
          perimeter within the Nexus matrix.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SecurityOverview user={user} />

        <div className="lg:col-span-2 space-y-8">
          <TwoFactorAuth
            twoFactorEnabled={
              (user as { twoFactorEnabled?: boolean })?.twoFactorEnabled ??
              false
            }
            onSetup={handleSetup2FA}
            loading={loading}
          />

          <ChangePasswordForm />

          <DangerZone />
        </div>
      </div>

      <TwoFactorDialog
        open={is2FADialogOpen}
        onOpenChange={setIs2FADialogOpen}
        qrCodeUrl={qrCodeUrl}
        otpToken={otpToken}
        setOtpToken={setOtpToken}
        onVerify={handleVerify2FA}
        loading={verifying2FA}
      />
    </div>
  );
}
