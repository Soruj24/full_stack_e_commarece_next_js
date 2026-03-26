"use client";

import { useState } from "react";
import { Eye, ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLocalization } from "@/context/LocalizationContext";
import { toast } from "sonner";
import { IProduct } from "@/types";
import { QuickViewGallery } from "./quickview/QuickViewGallery";
import { QuickViewInfo } from "./quickview/QuickViewInfo";

interface QuickViewProps {
  product: IProduct;
  trigger?: React.ReactNode;
}

export function QuickView({ product, trigger }: QuickViewProps) {
  const { currency } = useLocalization();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const hasDiscount = (product.discountPrice ?? 0) > 0 && (product.discountPrice ?? 0) < product.price;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      id: product._id,
      name: product.name,
      price: currentPrice,
      image: product.images?.[0],
      quantity: quantity,
      stock: product.stock,
    });

    setTimeout(() => {
      setIsAdding(false);
      toast.success(`${product.name} added to cart!`);
    }, 1000);
  };

  const isWishlisted = isInWishlist(product._id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-md border-border/40 hover:bg-primary hover:text-white transition-all duration-500"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border/40 rounded-[32px] sm:rounded-[40px] shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full max-h-[90vh] overflow-y-auto no-scrollbar">
          <QuickViewGallery
            product={product}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />

          <div className="p-8 flex flex-col">
            <QuickViewInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
              isAdding={isAdding}
              currency={currency}
            />

            <div className="flex gap-3 mt-6">
              <Button
                size="lg"
                className="flex-1 h-14 rounded-xl font-bold shadow-lg shadow-primary/20"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
              >
                {isAdding ? (
                  <span className="animate-pulse">Adding...</span>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 rounded-xl"
                onClick={() => toggleWishlist(product._id)}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{product.rating || 4.5} out of 5</span>
                <span>({product.numReviews || 128} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  (product.stock ?? 0) > 10 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : (product.stock ?? 0) > 0
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {(product.stock ?? 0) > 10 
                    ? "In Stock"
                    : (product.stock ?? 0) > 0
                    ? `Only ${product.stock} left`
                    : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
