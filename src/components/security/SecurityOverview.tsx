"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, History } from "lucide-react";

interface SecurityOverviewProps {
  user: unknown;
}

export function SecurityOverview({ user }: SecurityOverviewProps) {
  return (
    <div className="lg:col-span-1 space-y-8">
      <Card className="border-none shadow-2xl shadow-primary/5 rounded-[40px] overflow-hidden bg-muted/30 backdrop-blur-md border border-border/40">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            <div className="p-2 bg-primary/10 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
            Security Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/40">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Status
              </span>
              <span className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Secure
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/40">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                MFA Uplink
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                  (user as { twoFactorEnabled?: boolean })?.twoFactorEnabled
                    ? "text-green-500"
                    : "text-amber-500"
                }`}
              >
                {(user as { twoFactorEnabled?: boolean })?.twoFactorEnabled
                  ? "ACTIVE"
                  : "INACTIVE"}
              </span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground/70 leading-relaxed uppercase tracking-widest px-1">
            Your identity is secured by the Nexus core. Maintain active MFA for
            maximum perimeter integrity.
          </p>
        </CardContent>
      </Card>

      <div className="p-8 rounded-[40px] border border-dashed border-border/60 bg-muted/10 flex flex-col items-center text-center gap-6">
        <div className="p-4 bg-primary/10 rounded-2xl">
          <History className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-black text-[11px] uppercase tracking-[0.3em]">
            Protocol Logs
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
            Review identity access logs and system transmissions.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full h-12 rounded-2xl border border-border/40 bg-background hover:bg-muted/50 transition-all font-black uppercase text-[10px] tracking-[0.2em]"
        >
          Access Audit Logs
        </Button>
      </div>
    </div>
  );
}
