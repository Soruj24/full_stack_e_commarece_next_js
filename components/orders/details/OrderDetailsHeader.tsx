"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Printer, ChevronLeft } from "lucide-react";
import { generateInvoicePDF } from "@/lib/invoice";
import { IOrder } from "@/types";

interface OrderDetailsHeaderProps {
  order: IOrder;
}

export function OrderDetailsHeader({ order }: OrderDetailsHeaderProps) {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center justify-between print:hidden">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
      >
        <ChevronLeft className="w-4 h-4" /> Back to History
      </Button>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="rounded-2xl px-4 font-bold border-border/50 gap-2 h-10 text-xs"
          onClick={handlePrint}
        >
          <Printer className="w-3 h-3" /> Print
        </Button>
        <Button
          variant="outline"
          className="rounded-2xl px-4 font-bold border-border/50 gap-2 h-10 text-xs"
          onClick={() => generateInvoicePDF(order)}
        >
          <Download className="w-3 h-3" /> PDF
        </Button>
      </div>
    </div>
  );
}