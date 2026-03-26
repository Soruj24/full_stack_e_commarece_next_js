// app/products/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ChevronRight,
  Share2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ReviewSection } from "@/components/products/ReviewSection";
import { cn, getFallbackImage, getSafeImageSrc } from "@/lib/utils";
import { toast } from "sonner";
import {
  trackEvent,
  ANALYTICS_CATEGORIES,
  ANALYTICS_ACTIONS,
} from "@/lib/analytics";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { RecentlyViewedProducts } from "@/components/products/RecentlyViewedProducts";
import { StockStatusBadge, BackInStockAlert } from "@/components/products/StockStatus";
import { PriceHistoryChart, PriceComparisonBadge } from "@/components/products/PriceHistory";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addProduct } = useRecentlyViewed();
  interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    images?: string[];
    category: {
      name: string;
      slug: string;
    };
    brand?: string;
    stock: number;
    rating?: number;
    numReviews?: number;
    averageRating?: number;
    tags?: string[];
    shippingOptions?: Array<{
      method: string;
      price: number;
      estimatedDays: string;
    }>;
    reviews?: {
      _id: string;
      user: {
        name: string;
      };
      rating: number;
      comment: string;
      createdAt: string;
    }[];
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  // JSON-LD structured data
  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.images,
        description: product.description,
        brand: {
          "@type": "Brand",
          name: product.brand || "BrandName",
        },
        offers: {
          "@type": "Offer",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product._id}`,
          priceCurrency: "USD",
          price: product.price,
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.averageRating || 5,
          reviewCount: product.numReviews || 0,
        },
      }
    : null;

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      trackEvent({
        action: ANALYTICS_ACTIONS.VIEW_PRODUCT,
        category: ANALYTICS_CATEGORIES.ECOMMERCE,
        label: product.name,
        value: product.price,
        items: [
          {
            item_id: product._id,
            item_name: product.name,
            price: product.price,
          },
        ],
      });

      addProduct({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        slug: id,
        category: product.category?.name,
      });
    }
  }, [product, id, addProduct]);

  const handleAddToCart = () => {
    if (product) {
      trackEvent({
        action: ANALYTICS_ACTIONS.ADD_TO_CART,
        category: ANALYTICS_CATEGORIES.ECOMMERCE,
        label: product.name,
        value: product.price * quantity,
        items: [
          {
            item_id: product._id,
            item_name: product.name,
            price: product.price,
            quantity: quantity,
          },
        ],
      });
      toast.success(`${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background/95 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <div className="aspect-square rounded-3xl bg-muted animate-pulse" />
              <div className="grid grid-cols-4 gap-4 mt-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-muted animate-pulse" />
                ))}
              </div>
              <div className="h-12 w-32 bg-muted rounded animate-pulse" />
              <div className="p-8 rounded-3xl bg-muted/50 space-y-4">
                <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                <div className="flex gap-4">
                  <div className="h-12 w-full bg-muted rounded-xl animate-pulse" />
                  <div className="h-12 w-20 bg-muted rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-4xl font-black mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The product you are looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/products">
          <Button variant="default" className="rounded-2xl px-8 font-black">
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 selection:bg-primary/10 selection:text-primary pb-24">
      {/* Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-12 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href="/products"
            className="hover:text-primary transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-primary transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3 text-primary/50" />
          <span className="text-primary truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Images */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-border/50 shadow-2xl shadow-primary/5 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={getSafeImageSrc(
                      product.images?.[activeImage],
                      product.category?.slug,
                    )}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getFallbackImage(product.category?.slug);
                      setImageError(true);
                    }}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-6 right-6 z-10">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border-transparent"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {(product.images || []).map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    activeImage === idx
                      ? "border-primary shadow-xl shadow-primary/10 scale-95"
                      : "border-transparent hover:border-primary/30",
                  )}
                >
                  <Image
                    src={getSafeImageSrc(img, product.category?.slug)}
                    alt={`${product.name} ${idx}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getFallbackImage(product.category?.slug);
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-10"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {product.category.name}
                </span>
                <span className="bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {product.brand}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1]">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-primary/5 px-3 py-1.5 rounded-xl">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm font-black ml-1.5 text-primary">
                    {(product.rating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                  {product.numReviews} Verified Reviews
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {(product.discountPrice || product.price) && (
                <p className="text-muted-foreground line-through font-bold text-lg">
                  ${((product.discountPrice || product.price) * 1.15).toFixed(2)}
                </p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-5xl font-black tracking-tighter">
                  ${(product.discountPrice || product.price || 0).toFixed(2)}
                </span>
                {product.discountPrice && product.price && product.discountPrice < product.price && (
                  <div className="flex flex-col gap-2">
                    <span className="bg-primary text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      Save {Math.round((1 - product.discountPrice / product.price) * 100)}%
                    </span>
                    <PriceComparisonBadge productId={product._id} />
                  </div>
                )}
                {!product.discountPrice || product.discountPrice >= product.price ? (
                  <PriceComparisonBadge productId={product._id} />
                ) : null}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-2xl shadow-primary/5 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Quantity
                  </Label>
                  <StockStatusBadge 
                    stock={product.stock} 
                    variant="badge"
                    showIcon={false}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-muted/50 p-1.5 rounded-2xl border border-border/50">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-xl hover:bg-background h-10 w-10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={product.stock === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-black text-lg">
                      {quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-xl hover:bg-background h-10 w-10"
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={product.stock === 0}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    className="flex-1 rounded-2xl h-[52px] font-black text-sm gap-3 shadow-xl shadow-primary/20"
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 rounded-2xl h-[52px] font-black text-sm gap-2 border-border/50 transition-colors",
                    isInWishlist(product._id) &&
                      "bg-red-50 text-red-500 border-red-200 hover:bg-red-100",
                  )}
                  onClick={() => toggleWishlist(product._id)}
                >
                  <Heart
                    className={cn(
                      "w-5 h-5",
                      isInWishlist(product._id) && "fill-current",
                    )}
                  />
                  {isInWishlist(product._id) ? "In Wishlist" : "Wishlist"}
                </Button>
              </div>

              {product.stock === 0 && (
                <BackInStockAlert
                  productId={product._id}
                  productName={product.name}
                  productImage={product.images?.[0]}
                  variant="card"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 flex flex-col items-center text-center space-y-3">
                <Truck className="w-6 h-6 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Free Shipping
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 flex flex-col items-center text-center space-y-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  2 Year Warranty
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 flex flex-col items-center text-center space-y-3">
                <RotateCcw className="w-6 h-6 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  30 Day Return
                </p>
              </div>
            </div>

            <PriceHistoryChart
              productId={product._id}
              productName={product.name}
              currentPrice={product.price}
              className="mt-6"
            />
          </motion.div>
        </div>

        {/* Description & Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24 space-y-12"
        >
          <div className="border-b border-border/50">
            <div className="flex gap-12">
              <button className="pb-6 border-b-4 border-primary text-xl font-black tracking-tight">
                Product Description
              </button>
              <button className="pb-6 border-b-4 border-transparent text-xl font-black tracking-tight text-muted-foreground hover:text-foreground transition-colors">
                Specifications
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-8">
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                {product.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-card border border-border/50">
                  <h4 className="font-black text-lg mb-4">Key Features</h4>
                  <ul className="space-y-3">
                    {(product.tags || []).map((tag: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-muted-foreground font-medium"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 rounded-3xl bg-card border border-border/50">
                  <h4 className="font-black text-lg mb-4">Shipping Info</h4>
                  <ul className="space-y-4">
                    {(product.shippingOptions || []).map(

                      (opt: { method: string; price: number; estimatedDays: string }, i: number) => (
                        <li
                          key={i}
                          className="flex items-center justify-between font-medium"
                        >
                          <span className="text-muted-foreground">
                            {opt.method}
                          </span>
                          <span className="font-black">
                            ${opt.price} ({opt.estimatedDays})
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-32 pt-32 border-t border-border/50"
        >
          <ReviewSection
            productId={product._id}
            reviews={product.reviews}
            onReviewSubmit={fetchProduct}
          />
        </motion.div>

        {/* Recently Viewed Section */}
        <div id="recently-viewed" className="mt-20 pt-20 border-t border-border/50">
          <RecentlyViewedProducts
            title="Recently Viewed"
            maxProducts={6}
            showClearButton
          />
        </div>
      </div>
    </div>
  );
}
