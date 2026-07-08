"use client";

import { AnimatePresence } from "framer-motion";
import { Gift, Check, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/shared/types";
import { useBundleBuilder } from "@/modules/bundles/hooks/use-bundle-builder";
import { BundleBuilderHeader } from "./bundle-builder/BundleBuilderHeader";
import { BundleItemRow } from "./bundle-builder/BundleItemRow";
import { BundleSavingsSummary } from "./bundle-builder/BundleSavingsSummary";
import { AvailableProductsGrid } from "./bundle-builder/AvailableProductsGrid";
import type { BundleItem } from "@/modules/bundles/types/bundle";

interface BundleBuilderProps {
  products: IProduct[];
  bundleName?: string;
  onBundleComplete?: (bundle: BundleItem[]) => void;
}

export function BundleBuilder({ products, bundleName = "Custom Bundle", onBundleComplete }: BundleBuilderProps) {
  const {
    items, isAddingToCart, showAdded, MIN_ITEMS, MAX_ITEMS,
    addItem, removeItem, updateQuantity,
    handleAddBundleToCart, availableProducts, savings,
  } = useBundleBuilder(products, bundleName, onBundleComplete);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 overflow-hidden">
      <BundleBuilderHeader itemsCount={items.length} minItems={MIN_ITEMS} maxItems={MAX_ITEMS} />

      {items.length > 0 && (
        <div className="p-6 border-b border-zinc-200 dark:border-white/10">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Your Bundle Items
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <BundleItemRow key={item.product._id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
              ))}
            </AnimatePresence>
          </div>

          {items.length >= MIN_ITEMS && (
            <BundleSavingsSummary original={savings.original} discounted={savings.discounted} savings={savings.savings} />
          )}

          <Button onClick={handleAddBundleToCart} disabled={items.length < MIN_ITEMS || isAddingToCart} className="w-full mt-4 h-12 rounded-xl font-bold text-sm">
            {isAddingToCart ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding Bundle...</>
            ) : showAdded ? (
              <><Check className="w-4 h-4 mr-2" />Bundle Added!</>
            ) : (
              <><ShoppingCart className="w-4 h-4 mr-2" />Add Bundle to Cart</>
            )}
          </Button>
        </div>
      )}

      <AvailableProductsGrid products={availableProducts} onAddItem={addItem} />
    </div>
  );
}
