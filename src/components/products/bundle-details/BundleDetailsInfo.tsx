"use client";

import Image from "next/image";
import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { BundleProduct } from "@/modules/bundles/context/BundleContext";

interface BundleDetailsInfoProps {
  name: string;
  brand?: string;
  description: string;
  bundlePrice: number;
  originalPrice: number;
  discount: number;
  products: BundleProduct[];
}

export function BundleDetailsInfo({
  name,
  brand,
  description,
  bundlePrice,
  originalPrice,
  discount,
  products,
}: BundleDetailsInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        {brand && (
          <span className="text-sm font-medium text-muted-foreground">{brand}</span>
        )}
        <h1 className="text-3xl lg:text-4xl font-black mt-1">{name}</h1>
      </div>

      <p className="text-muted-foreground">{description}</p>

      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-black text-primary">
          ${bundlePrice.toFixed(2)}
        </span>
        <span className="text-xl text-muted-foreground line-through">
          ${originalPrice.toFixed(2)}
        </span>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <p className="text-green-700 dark:text-green-400 font-semibold">
          You save ${discount.toFixed(2)} with this bundle!
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">What&apos;s Included:</h3>
        <div className="grid gap-3">
          {products.map((product, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold line-clamp-1">{product.name}</p>
                <p className="text-sm text-muted-foreground">Included in bundle</p>
              </div>
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-xl">
          <Truck className="w-5 h-5 text-primary mb-2" />
          <span className="text-xs font-medium">Free Shipping</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-primary mb-2" />
          <span className="text-xs font-medium">Secure Payment</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-xl">
          <RotateCcw className="w-5 h-5 text-primary mb-2" />
          <span className="text-xs font-medium">30-Day Returns</span>
        </div>
      </div>
    </div>
  );
}
