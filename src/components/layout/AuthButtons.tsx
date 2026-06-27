"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button
        variant="ghost"
        asChild
        className="rounded-full px-4 sm:px-6 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 hidden xs:flex"
      >
        <Link href="/login">Sign In</Link>
      </Button>
      <Button
        asChild
        className="rounded-full px-3 sm:px-6 h-8 sm:h-11 text-[9px] sm:text-[11px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-95"
      >
        <Link href="/register">Join Nexus</Link>
      </Button>
    </div>
  );
}
