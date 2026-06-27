"use client";

import { GitCompare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CompareEmptyState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <GitCompare className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">No Products to Compare</h1>
        <p className="text-muted-foreground mb-8">
          Start comparing products by adding them from the product listing page.
        </p>
        <Button asChild size="lg" className="rounded-xl">
          <Link href="/products">
            <Plus className="w-5 h-5 mr-2" />
            Browse Products
          </Link>
        </Button>
      </div>
    </div>
  );
}