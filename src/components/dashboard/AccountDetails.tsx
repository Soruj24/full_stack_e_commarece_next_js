"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Shield } from "lucide-react";
import { Session } from "next-auth";

interface AccountDetailsProps {
  session: Session;
}

export function AccountDetails({ session }: AccountDetailsProps) {
  return (
    <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-foreground text-background">
      <CardContent className="p-10 space-y-10">
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="h-14 w-14 bg-primary/10 rounded-[22px] flex items-center justify-center text-primary shadow-lg shadow-primary/5">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">
                Account Details
              </h3>
              <p className="text-xs font-bold text-background/40 uppercase tracking-widest">
                Profile Status
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="group flex justify-between items-center border-b border-background/5 pb-6">
              <div className="space-y-1">
                <span className="text-background/40 font-black text-[10px] uppercase tracking-[0.2em]">
                  Role
                </span>
                <p className="text-sm font-black text-background/90 group-hover:text-primary transition-colors">
                  Current Access Level
                </p>
              </div>
              <span className="font-black text-primary uppercase tracking-widest text-[11px] bg-primary/10 px-5 py-2 rounded-[14px] border border-primary/10">
                {(session.user as { role?: string }).role || "User"}
              </span>
            </div>

            <div className="group flex justify-between items-center border-b border-background/5 pb-6">
              <div className="space-y-1">
                <span className="text-background/40 font-black text-[10px] uppercase tracking-[0.2em]">
                  Status
                </span>
                <p className="text-sm font-black text-background/90 group-hover:text-green-500 transition-colors">
                  Account Integrity
                </p>
              </div>
              <div className="flex items-center gap-3 bg-green-500/5 px-5 py-2 rounded-[14px] border border-green-500/10">
                <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
                <span className="font-black text-green-500 uppercase tracking-widest text-[11px]">
                  Active
                </span>
              </div>
            </div>

            <div className="group flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-background/40 font-black text-[10px] uppercase tracking-[0.2em]">
                  Verification
                </span>
                <p className="text-sm font-black text-background/90 group-hover:text-primary transition-colors">
                  Email & Identity
                </p>
              </div>
              <div className="h-12 w-12 rounded-[18px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div className="p-8 bg-background/5 rounded-[32px] border border-background/5 relative overflow-hidden group hover:bg-background/10 transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
              <Shield className="h-24 w-24" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">
              Membership
            </p>
            <p className="text-sm font-bold text-background/60 leading-relaxed relative z-10">
              Your account is fully protected and verified. Enjoy all premium
              features and priority support.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
