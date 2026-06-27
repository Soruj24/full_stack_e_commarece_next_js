"use client";

import { GitCompare, ArrowLeft, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CompareHeaderProps {
  productCount: number;
  maxProducts: number;
  onClearAll: () => void;
}

export function CompareHeader({ productCount, maxProducts, onClearAll }: CompareHeaderProps) {
  const router = useRouter();

  return (
    <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-primary" />
                Compare Products
              </h1>
              <p className="text-sm text-muted-foreground">
                {productCount} of {maxProducts} products
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClearAll} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
            {productCount < maxProducts && (
              <Button asChild className="gap-2">
                <Link href="/products">
                  <Plus className="w-4 h-4" />
                  Add More
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}