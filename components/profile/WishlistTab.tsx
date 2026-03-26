"use client";

import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function WishlistTab() {
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="p-6 bg-muted rounded-full">
          <Heart className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black">Your wishlist is empty</h3>
          <p className="text-muted-foreground max-w-sm">
            Looks like you haven't added anything to your wishlist yet.
          </p>
        </div>
        <Link href="/products">
          <Button className="rounded-2xl font-black">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">My Wishlist</h2>
        <span className="text-sm font-bold text-muted-foreground">
          {wishlist.length} Items
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
