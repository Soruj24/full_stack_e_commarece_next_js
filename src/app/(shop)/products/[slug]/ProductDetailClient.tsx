"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
  Check,
  Info,
  Copy,
} from "lucide-react";
import { cn, getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import { useCart } from "@/modules/cart/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { PremiumGallery } from "./PremiumGallery";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: { name: string; slug: string };
  brand?: string;
  brandRef?: { name: string; slug: string; logo?: string };
  tags?: string[];
  colors?: string[];
  sizes?: string[];
  stock: number;
  sku?: string;
  rating?: number;
  numReviews?: number;
  reviews?: { user: string; name: string; rating: number; comment: string; createdAt: string }[];
  shippingOptions?: { method: string; price: number; estimatedDays: string }[];
  specifications?: { key: string; value: string; group?: string }[];
  variants?: { name: string; price: number; stock: number; color?: string; size?: string; images?: string[] }[];
  warranty?: string;
  weight?: number;
  weightUnit?: string;
  dimensions?: { length: number; width: number; height: number; unit: string };
}

interface RelatedProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  rating?: number;
  numReviews?: number;
  brand?: string;
}

interface Props {
  product: Product;
  relatedProducts: RelatedProduct[];
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const displayPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= (product as any).lowStockThreshold || 10;

  const specs = useMemo(() => {
    if (!product.specifications?.length) return [];
    const grouped: Record<string, { key: string; value: string }[]> = {};
    product.specifications.forEach((s) => {
      const group = s.group || "General";
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push({ key: s.key, value: s.value });
    });
    return Object.entries(grouped);
  }, [product.specifications]);

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: displayPrice,
      image: product.images?.[0] || "",
      quantity,
      stock: product.stock,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const avgRating = product.rating || 0;
  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews?.filter((r) => Math.round(r.rating) === star).length || 0,
  }));
  const maxCount = Math.max(...ratingDist.map((r) => r.count), 1);

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/8 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link href={`/products?category=${product.category?.slug}`} className="hover:text-primary transition-colors">
            {product.category?.name}
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0 text-primary/50" />
          <span className="text-primary truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left: Gallery */}
          <div className="lg:col-span-7">
            <PremiumGallery
              images={product.images}
              productName={product.name}
              categorySlug={product.category?.slug}
            />
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.category && (
                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {product.category.name}
                </Badge>
              )}
              {(product.brand || product.brandRef?.name) && (
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {product.brand || product.brandRef?.name}
                </Badge>
              )}
              {discountPercent > 0 && (
                <Badge variant="destructive" className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  -{discountPercent}%
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-xl">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="text-sm font-bold text-primary">{avgRating.toFixed(1)}</span>
              </div>
              <button
                onClick={() => document.getElementById("reviews-tab")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {product.numReviews || 0} reviews
              </button>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground font-medium">
                {product.stock} in stock
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {originalPrice && (
                <p className="text-muted-foreground line-through text-lg font-bold">
                  ${originalPrice.toFixed(2)}
                </p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-4xl font-black tracking-tight">
                  ${displayPrice.toFixed(2)}
                </span>
                {discountPercent > 0 && (
                  <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                    You save ${(originalPrice! - displayPrice).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <Label text="Color" value={selectedColor} />
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <TooltipProvider key={color}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                              "w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110",
                              selectedColor === color
                                ? "border-primary ring-2 ring-primary/20 shadow-lg"
                                : "border-border/50 hover:border-primary/50"
                            )}
                            style={{ backgroundColor: color.toLowerCase() }}
                            aria-label={color}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <Label text="Size" value={selectedSize} />
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[48px] h-11 px-4 rounded-xl border-2 text-sm font-bold transition-all duration-200 hover:scale-105",
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "border-border/50 hover:border-primary/50 bg-background"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="space-y-4">
              <Label text="Quantity" value={`${product.stock} available`} />
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-muted/50 p-1.5 rounded-2xl border border-border/50">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-xl"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!inStock}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-black text-lg">{quantity}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-xl"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={!inStock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  className="flex-1 h-12 rounded-2xl font-bold text-sm gap-2 shadow-xl shadow-primary/20"
                  disabled={!inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>

              {/* Buy Now */}
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl font-bold text-sm gap-2 border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                disabled={!inStock}
                onClick={handleBuyNow}
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </Button>
            </div>

            {/* Wishlist + Share */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className={cn(
                  "flex-1 h-11 rounded-2xl font-bold text-sm gap-2 border-border/50",
                  isWishlisted && "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                )}
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
                }}
              >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                {isWishlisted ? "In Wishlist" : "Wishlist"}
              </Button>
              <Button
                variant="outline"
                className="h-11 w-11 rounded-2xl border-border/50"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: "Free Shipping", sub: "Orders over $50" },
                { icon: ShieldCheck, text: "2 Year Warranty", sub: "Full coverage" },
                { icon: RotateCcw, text: "30 Day Returns", sub: "Hassle-free" },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="p-3 rounded-2xl bg-muted/30 border border-border/30 flex flex-col items-center text-center gap-1.5">
                  <Icon className="w-5 h-5 text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-wider leading-tight">{text}</p>
                  <p className="text-[9px] text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>

            {/* Shipping Options */}
            {product.shippingOptions && product.shippingOptions.length > 0 && (
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4" /> Shipping Options
                </h4>
                {product.shippingOptions.map((opt, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">{opt.method}</span>
                    <span className="font-bold">
                      {opt.price === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                      ) : (
                        `$${opt.price}`
                      )}{" "}
                      <span className="text-muted-foreground text-xs font-normal">({opt.estimatedDays})</span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* SKU */}
            {product.sku && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold">SKU:</span>
                <span>{product.sku}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Description, Specifications, Reviews, FAQ */}
        <div className="mt-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
            <TabsList className="w-full justify-start gap-8 border-b border-border/50 bg-transparent p-0 h-auto">
              <TabsTrigger value="description" className="pb-4 text-base font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="pb-4 text-base font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0">
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                id="reviews-tab"
                className="pb-4 text-base font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0"
              >
                Reviews ({product.numReviews || 0})
              </TabsTrigger>
              <TabsTrigger value="faq" className="pb-4 text-base font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-0">
                FAQ
              </TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="p-6 rounded-2xl bg-card border border-border/30">
                      <h4 className="font-black text-lg mb-4">Key Features</h4>
                      <ul className="space-y-3">
                        {product.tags.map((tag, i) => (
                          <li key={i} className="flex items-center gap-3 text-muted-foreground font-medium text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="p-6 rounded-2xl bg-card border border-border/30">
                      <h4 className="font-black text-lg mb-3">Warranty</h4>
                      <p className="text-muted-foreground text-sm">{product.warranty}</p>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-4">
                  <div className="p-6 rounded-2xl bg-muted/20 border border-border/30 space-y-4">
                    <h4 className="font-black text-lg">Product Details</h4>
                    <div className="space-y-3 text-sm">
                      {product.brand && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Brand</span>
                          <span className="font-semibold">{product.brand}</span>
                        </div>
                      )}
                      {product.weight && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight</span>
                          <span className="font-semibold">{product.weight} {product.weightUnit || "kg"}</span>
                        </div>
                      )}
                      {product.dimensions && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dimensions</span>
                          <span className="font-semibold">
                            {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SKU</span>
                        <span className="font-semibold">{product.sku || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="pt-8">
              {specs.length > 0 ? (
                <div className="space-y-8">
                  {specs.map(([group, items]) => (
                    <div key={group}>
                      <h3 className="text-lg font-black mb-4">{group}</h3>
                      <div className="rounded-2xl border border-border/30 overflow-hidden">
                        {items.map((item, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex items-center px-6 py-3 text-sm",
                              i % 2 === 0 ? "bg-muted/20" : "bg-transparent"
                            )}
                          >
                            <span className="w-1/3 text-muted-foreground font-medium">{item.key}</span>
                            <span className="w-2/3 font-semibold">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-12">No specifications available for this product.</p>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Summary */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="text-center p-8 rounded-2xl bg-card border border-border/30">
                    <div className="text-6xl font-black">{avgRating.toFixed(1)}</div>
                    <div className="flex justify-center gap-1 my-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            "w-5 h-5",
                            s <= Math.round(avgRating)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Based on {product.numReviews || 0} reviews
                    </p>
                  </div>
                  <div className="space-y-2">
                    {ratingDist.map(({ star, count }) => (
                      <div key={star} className="flex items-center gap-3 text-sm">
                        <span className="w-8 text-right font-semibold">{star}</span>
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <div className="flex-1 h-2 rounded-full bg-muted/50 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                        <span className="w-8 text-muted-foreground font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review List */}
                <div className="lg:col-span-8 space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 rounded-2xl bg-card border border-border/30 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {review.name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{review.name}</p>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={cn(
                                      "w-3 h-3",
                                      s <= review.rating
                                        ? "fill-primary text-primary"
                                        : "text-muted-foreground/30"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-12">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="pt-8 max-w-3xl">
              <Accordion type="single" collapsible className="space-y-2">
                {[
                  {
                    q: "What is the return policy?",
                    a: "We offer a 30-day hassle-free return policy. If you're not satisfied with your purchase, you can return it within 30 days for a full refund or exchange. The product must be in its original condition with all packaging intact.",
                  },
                  {
                    q: "How long does shipping take?",
                    a: "Standard shipping takes 3-5 business days. Express shipping delivers within 1-2 business days. Free shipping is available on orders over $50. International shipping may take 7-14 business days depending on your location.",
                  },
                  {
                    q: "Is this product covered by warranty?",
                    a: product.warranty
                      ? `Yes, this product comes with a ${product.warranty}. The warranty covers manufacturing defects and hardware failures under normal use conditions.`
                      : "Yes, all our products come with a standard 2-year manufacturer warranty covering manufacturing defects and hardware failures.",
                  },
                  {
                    q: "Can I track my order?",
                    a: "Yes! Once your order ships, you'll receive a confirmation email with a tracking number. You can use this number to track your package in real-time through our website or the carrier's tracking page.",
                  },
                  {
                    q: "What payment methods are accepted?",
                    a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secured with 256-bit SSL encryption.",
                  },
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-border/30 rounded-2xl px-6">
                    <AccordionTrigger className="text-sm font-bold py-5">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight">You May Also Like</h2>
              <Link
                href={`/products?category=${product.category?.slug}`}
                className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp._id}
                  href={`/products/${rp.slug || rp._id}`}
                  className="group p-4 rounded-2xl bg-card border border-border/30 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-muted/20">
                    <Image
                      src={getSafeImageSrc(rp.images?.[0], product.category?.slug)}
                      alt={rp.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {rp.discountPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        -{Math.round((1 - rp.discountPrice / rp.price) * 100)}%
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {rp.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg">
                      ${(rp.discountPrice || rp.price).toFixed(2)}
                    </span>
                    {rp.discountPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${rp.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {rp.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs font-semibold">{rp.rating.toFixed(1)}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ text, value }: { text: string; value?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{text}</span>
      {value && (
        <>
          <span className="text-muted-foreground">:</span>
          <span className="text-xs font-bold text-foreground">{value}</span>
        </>
      )}
    </div>
  );
}
