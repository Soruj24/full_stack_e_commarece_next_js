"use client";

import { CheckCircle2, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationHeaderProps {
  orderId: string;
  onPrint: () => void;
  onDownload: () => void;
}

export function ConfirmationHeader({ orderId, onPrint, onDownload }: ConfirmationHeaderProps) {
  return (
    <div className="text-center space-y-6 print:hidden">
      <div className="inline-flex p-6 rounded-[40px] bg-primary/10 text-primary animate-bounce">
        <CheckCircle2 className="w-16 h-16" />
      </div>
      <div className="space-y-2">
        <h1 className="text-5xl font-black tracking-tighter">
          Order <span className="text-primary">Confirmed!</span>
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Thank you for your purchase. Your order #{orderId.slice(-8).toUpperCase()} is being processed.
        </p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          className="rounded-2xl px-8 font-bold border-border/50 gap-2"
          onClick={onPrint}
        >
          <Printer className="w-4 h-4" /> Print Invoice
        </Button>
        <Button
          variant="outline"
          className="rounded-2xl px-8 font-bold border-border/50 gap-2"
          onClick={onDownload}
        >
          <Download className="w-4 h-4" /> PDF Download
        </Button>
      </div>
    </div>
  );
}