"use client";

import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ProductsPageEmpty() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-card/50 rounded-[40px] border-2 border-dashed border-border/50 p-12 text-center">
      <div className="p-6 bg-muted rounded-full mb-6">
        <SlidersHorizontal className="w-12 h-12 text-muted-foreground/30" />
      </div>
      <h3 className="text-2xl font-black tracking-tight mb-2">No products found</h3>
      <p className="text-muted-foreground font-medium max-w-sm">
        We couldn&apos;t find any products matching your current filters. Try adjusting your search or resetting filters.
      </p>
      <Button variant="default" className="mt-8 rounded-2xl px-8 font-black shadow-xl shadow-primary/20"
        onClick={() => router.push("/products")}>Clear All Filters</Button>
    </div>
  );
}
