"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bundle, useBundle } from "@/modules/bundles/context/BundleContext";
import { toast } from "sonner";
import { BundleDetailsSkeleton } from "./bundle-details/BundleDetailsSkeleton";
import { BundleDetailsNotFound } from "./bundle-details/BundleDetailsNotFound";
import { BundleDetailsImageGallery } from "./bundle-details/BundleDetailsImageGallery";
import { BundleDetailsInfo } from "./bundle-details/BundleDetailsInfo";
import { BundleDetailsActions } from "./bundle-details/BundleDetailsActions";

interface BundleDetailsProps {
  bundleId: string;
}

export function BundleDetails({ bundleId }: BundleDetailsProps) {
  const { getBundle, addBundleToCart, isBundleInCart } = useBundle();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const fetchBundle = async () => {
      setLoading(true);
      const data = await getBundle(bundleId);
      setBundle(data);
      setLoading(false);
    };
    fetchBundle();
  }, [bundleId, getBundle]);

  if (loading) return <BundleDetailsSkeleton />;
  if (!bundle) return <BundleDetailsNotFound />;

  const inCart = isBundleInCart(bundle._id);
  const isOutOfStock = bundle.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This bundle is currently out of stock");
      return;
    }
    setIsAdding(true);
    addBundleToCart(bundle, quantity);
    setTimeout(() => {
      setJustAdded(true);
      setIsAdding(false);
      toast.success(`${bundle.name} added to cart!`);
      setTimeout(() => setJustAdded(false), 2000);
    }, 500);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <BundleDetailsImageGallery
              products={bundle.products}
              discountPercentage={bundle.discountPercentage}
              stock={bundle.stock}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <BundleDetailsInfo
              name={bundle.name}
              brand={bundle.brand}
              description={bundle.description}
              bundlePrice={bundle.bundlePrice}
              originalPrice={bundle.originalPrice}
              discount={bundle.discount}
              products={bundle.products}
            />

            <BundleDetailsActions
              quantity={quantity}
              maxQuantity={bundle.maxQuantity || 10}
              bundlePrice={bundle.bundlePrice}
              isOutOfStock={isOutOfStock}
              inCart={inCart}
              isAdding={isAdding}
              justAdded={justAdded}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
