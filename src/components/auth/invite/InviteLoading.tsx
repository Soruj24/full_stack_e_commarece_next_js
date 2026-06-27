"use client";

import { Loader2 } from "lucide-react";

export function InviteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-black text-xl text-foreground uppercase tracking-widest">Verifying invitation...</p>
      </div>
    </div>
  );
}