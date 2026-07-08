"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BundleProduct } from "@/modules/bundles/context/BundleContext";

interface BundleDetailsImageGalleryProps {
  products: BundleProduct[];
  discountPercentage: number;
  stock: number;
}

export function BundleDetailsImageGallery({
  products,
  discountPercentage,
  stock,
}: BundleDetailsImageGalleryProps) {
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
        <Image
          src={products[0]?.image || "/placeholder.svg"}
          alt="Bundle"
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className="bg-primary text-white font-black text-lg px-4 py-1">
            -{discountPercentage}% OFF
          </Badge>
          {isLowStock && (
            <Badge variant="destructive" className="font-bold">
              Only {stock} left
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {products.map((product, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-xl overflow-hidden bg-muted"
          >
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
