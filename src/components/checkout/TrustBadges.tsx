"use client";

import { Shield, Lock, Clock } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-8 mt-12 text-muted-foreground">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4" />
        <span className="text-xs font-medium">Secure Checkout</span>
      </div>
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4" />
        <span className="text-xs font-medium">SSL Encrypted</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span className="text-xs font-medium">24/7 Support</span>
      </div>
    </div>
  );
}
