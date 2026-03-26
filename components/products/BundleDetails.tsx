"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Package,
  Tag,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bundle, useBundle } from "@/context/BundleContext";
import { toast } from "sonner";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-3xl" />
            <div className="space-y-4">
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
              <div className="h-12 w-full bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Bundle not found</h1>
        <p className="text-muted-foreground mb-6">
          This bundle may have expired or been removed.
        </p>
        <Link href="/bundles">
          <Button>Browse All Bundles</Button>
        </Link>
      </div>
    );
  }

  const inCart = isBundleInCart(bundle._id);
  const isLowStock = bundle.stock > 0 && bundle.stock <= 5;
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
              <Image
                src={bundle.products[0]?.image || "/placeholder.svg"}
                alt={bundle.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className="bg-primary text-white font-black text-lg px-4 py-1">
                  -{bundle.discountPercentage}% OFF
                </Badge>
                {isLowStock && (
                  <Badge variant="destructive" className="font-bold">
                    Only {bundle.stock} left
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {bundle.products.map((product, idx) => (
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              {bundle.brand && (
                <span className="text-sm font-medium text-muted-foreground">
                  {bundle.brand}
                </span>
              )}
              <h1 className="text-3xl lg:text-4xl font-black mt-1">{bundle.name}</h1>
            </div>

            <p className="text-muted-foreground">{bundle.description}</p>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-primary">
                ${bundle.bundlePrice.toFixed(2)}
              </span>
              <span className="text-xl text-muted-foreground line-through">
                ${bundle.originalPrice.toFixed(2)}
              </span>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <p className="text-green-700 dark:text-green-400 font-semibold">
                You save ${bundle.discount.toFixed(2)} with this bundle!
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">What&apos;s Included:</h3>
              <div className="grid gap-3">
                {bundle.products.map((product, idx) => (
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
                      <p className="text-sm text-muted-foreground">
                        Included in bundle
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-xl">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setQuantity(
                      Math.min(
                        bundle.maxQuantity || 10,
                        quantity + 1
                      )
                    )
                  }
                  disabled={quantity >= (bundle.maxQuantity || 10)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                Max: {bundle.maxQuantity || 10} per order
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={isAdding || isOutOfStock || inCart}
              className={cn(
                "w-full h-14 text-lg font-bold rounded-xl",
                justAdded && "bg-green-500 hover:bg-green-500"
              )}
            >
              {inCart ? (
                <>
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  Already in Cart
                </>
              ) : justAdded ? (
                <>
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  Added to Cart!
                </>
              ) : isAdding ? (
                "Adding to Cart..."
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  Add Bundle to Cart - ${(bundle.bundlePrice * quantity).toFixed(2)}
                </>
              )}
            </Button>

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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
