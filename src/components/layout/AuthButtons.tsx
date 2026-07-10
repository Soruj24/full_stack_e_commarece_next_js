"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-1.5">
      <Button variant="ghost" asChild
        className="hidden sm:inline-flex rounded-full px-4 h-9 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
        <Link href="/login">Sign In</Link>
      </Button>
      <Button asChild
        className="rounded-full px-5 h-9 text-[13px] font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-none">
        <Link href="/register">Get Started</Link>
      </Button>
    </div>
  );
}
