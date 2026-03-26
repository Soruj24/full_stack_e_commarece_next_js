"use client";

import { useSaveForLater } from "@/context/SaveForLaterContext";
import { SaveForLaterList } from "@/components/products/SaveForLater";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Package } from "lucide-react";

export default function SavedPage() {
  const { savedItems, getSavedCount } = useSaveForLater();
  const count = getSavedCount();

  return (
    <div className="min-h-screen bg-background/95 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">
              Saved <span className="text-primary">for Later</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              {count} item{count !== 1 ? "s" : ""} saved
            </p>
          </div>
          {count > 0 && (
            <Link href="/products">
              <Button variant="outline" className="gap-2 rounded-xl">
                Browse More Products
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Content */}
        {count > 0 ? (
          <SaveForLaterList variant="list" showHeader={false} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Saved Items</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              You haven&apos;t saved any items for later yet. Browse our products and save items you want to buy later.
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2 rounded-xl">
                <Package className="w-5 h-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        )}

        {/* Recommendations */}
        {count > 0 && (
          <div className="mt-16 pt-12 border-t">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <p className="text-muted-foreground">
              Based on your saved items, check out these recommendations
            </p>
            {/* Add product recommendations here */}
          </div>
        )}
      </div>
    </div>
  );
}
