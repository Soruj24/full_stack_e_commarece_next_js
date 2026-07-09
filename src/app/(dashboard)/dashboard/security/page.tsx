"use client";

import { useSession } from "next-auth/react";
import { Loader2, Shield } from "lucide-react";
import { SecuritySettings } from "@/components/dashboard/SecuritySettings";

export default function SecurityPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 bg-primary/10 rounded-[20px] flex items-center justify-center text-primary">
          <Shield className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Security</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your password and security preferences.</p>
        </div>
      </div>

      <SecuritySettings />
    </div>
  );
}
