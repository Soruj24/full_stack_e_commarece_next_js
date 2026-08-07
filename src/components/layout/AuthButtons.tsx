"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-1.5">
      <Button variant="ghost" asChild
        className="hidden sm:inline-flex rounded-lg px-3 h-8 text-[13px] font-medium text-muted-foreground hover:text-foreground">
        <Link href="/login">Sign In</Link>
      </Button>
      <Button asChild
        className="rounded-lg px-4 h-8 text-[13px] font-medium">
        <Link href="/register">Get Started</Link>
      </Button>
    </div>
  );
}
