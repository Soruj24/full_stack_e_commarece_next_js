"use client";

import { useCompare } from "@/context/CompareContext";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  CompareHeader,
  CompareEmptyState,
  CompareProductCard,
  CompareAddCard,
  CompareTable,
  CompareFeatures,
} from "@/components/compare";

export default function ComparePage() {
  const { products, removeProduct, clearAll, maxProducts } = useCompare();
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        quantity: 1,
        stock: product.stock || 10,
      });
      setAddedToCart((prev) => ({ ...prev, [productId]: true }));
      toast.success(`Added ${product.name} to cart`);
      setTimeout(() => {
        setAddedToCart((prev) => ({ ...prev, [productId]: false }));
      }, 2000);
    }
  };

  if (products.length === 0) {
    return <CompareEmptyState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <CompareHeader
        productCount={products.length}
        maxProducts={maxProducts}
        onClearAll={clearAll}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <CompareProductCard
                key={product._id}
                product={product}
                index={index}
                addedToCart={addedToCart[product._id] || false}
                onRemove={removeProduct}
                onAddToCart={handleAddToCart}
              />
            ))}
          </AnimatePresence>
          <CompareAddCard show={products.length < maxProducts} />
        </div>

        <CompareTable products={products} />

        <CompareFeatures products={products} />
      </div>
    </div>
  );
}