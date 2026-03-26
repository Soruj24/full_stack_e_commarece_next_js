"use client";

import { signOut } from "next-auth/react";
import { Ban, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 text-center border border-destructive/20">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Ban className="w-10 h-10 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">Account Banned</h1>
        <p className="text-muted-foreground mb-8">
          Your account has been suspended due to a violation of our terms of service or suspicious activity.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-xl border border-border text-left">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-primary" /> Need Help?
            </h3>
            <p className="text-sm text-muted-foreground">
              If you believe this is a mistake, please contact our support team at 
              <span className="text-primary font-medium ml-1">support@aiplatform.com</span>
            </p>
          </div>

          <Button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            variant="outline"
            className="w-full py-6 rounded-xl border-border hover:bg-muted text-foreground font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/60">
          Access to this application is restricted for banned accounts.
        </p>
      </div>
    </div>
  );
}
