"use client";

import { Check } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  features?: string[];
}

interface CompareFeaturesProps {
  products: Product[];
}

export function CompareFeatures({ products }: CompareFeaturesProps) {
  if (products.length < 2) return null;

  return (
    <div className="mt-8 bg-card rounded-3xl border border-border/50 shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="p-4 bg-muted/30 rounded-xl">
            <h3 className="font-semibold mb-2 truncate">{product.name}</h3>
            <ul className="space-y-2 text-sm">
              {(product.features || []).slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
              {(!product.features || product.features.length === 0) && (
                <li className="text-muted-foreground">No features listed</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}