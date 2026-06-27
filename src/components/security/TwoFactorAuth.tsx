"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Shield, Loader2 } from "lucide-react";

interface TwoFactorAuthProps {
  twoFactorEnabled: boolean;
  onSetup: () => void;
  loading: boolean;
}

export function TwoFactorAuth({
  twoFactorEnabled,
  onSetup,
  loading,
}: TwoFactorAuthProps) {
  return (
    <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden">
      <CardHeader className="bg-card border-b border-border py-6 px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                twoFactorEnabled
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Two-factor authentication adds an extra layer of security to your
              account. To log in, in addition to your password, you&apos;ll need to
              provide a code from a mobile app like Google Authenticator or
              Authy.
            </p>
            {!twoFactorEnabled ? (
              <Button
                onClick={onSetup}
                loading={loading}
                className="rounded-xl font-bold h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
              >
                <Shield className="w-4 h-4 mr-2" />
                Setup 2FA Now
              </Button>
            ) : (
              <Button
                variant="outline"
                className="rounded-xl font-bold h-11 px-6 border-destructive/20 text-destructive hover:bg-destructive/5"
              >
                Disable 2FA
              </Button>
            )}
          </div>
          <div className="hidden md:block p-8 bg-muted/30 rounded-[32px] border border-border/50">
            <Smartphone className="w-16 h-16 text-muted-foreground/20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
