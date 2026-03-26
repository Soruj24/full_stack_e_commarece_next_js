"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationFooterProps {
  show: boolean;
}

export function ConfirmationFooter({ show }: ConfirmationFooterProps) {
  if (!show) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 print:hidden">
      <div className="flex items-center gap-4 p-6 rounded-[32px] bg-muted/30 border border-border/50">
        <Clock className="w-5 h-5 text-primary" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          A confirmation email has been sent to your inbox.
        </p>
      </div>
      <Link href="/products">
        <Button className="rounded-[24px] px-12 h-16 font-black text-lg shadow-2xl shadow-primary/20 gap-3 group">
          Continue Shopping{" "}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
}