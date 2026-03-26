"use client";

import { Tag } from "lucide-react";

export function BrandsEmptyState() {
  return (
    <div className="col-span-full py-20 text-center">
      <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <Tag className="w-10 h-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-xl font-black text-muted-foreground">
        No brands found
      </h3>
      <p className="text-sm text-muted-foreground/70 mt-2">
        Try adjusting your search or add a new brand.
      </p>
    </div>
  );
}