"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { ReviewSection } from "@/components/products/ReviewSection";
import { RecentlyViewedProducts } from "@/components/products/RecentlyViewedProducts";
import { useProductDetail } from "@/hooks/use-product-detail";
import { ProductBreadcrumbs } from "@/components/products/detail/ProductBreadcrumbs";
import { ProductImageGallery } from "@/components/products/detail/ProductImageGallery";
import { ProductInfoHeader } from "@/components/products/detail/ProductInfoHeader";
import { ProductPricing } from "@/components/products/detail/ProductPricing";
import { ProductCartActions } from "@/components/products/detail/ProductCartActions";
import { ProductTrustBadges } from "@/components/products/detail/ProductTrustBadges";
import { ProductDescriptionSection } from "@/components/products/detail/ProductDescriptionSection";
import { ProductSkeleton } from "@/components/products/detail/ProductSkeleton";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const {
    product, loading, quantity, setQuantity,
    activeImage, setActiveImage, setImageError,
    handleAddToCart, refetch,
  } = useProductDetail(id);

  if (loading) return <ProductSkeleton />;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-4xl font-black mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">The product you are looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/products"><Button variant="default" className="rounded-2xl px-8 font-black">Back to Shop</Button></Link>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand || "BrandName" },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product._id}`,
      priceCurrency: "USD",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.averageRating || 5,
      reviewCount: product.numReviews || 0,
    },
  };

  return (
    <div className="min-h-screen bg-background/95 selection:bg-primary/10 selection:text-primary pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductBreadcrumbs category={product.category} productName={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <ProductImageGallery
            images={product.images || []}
            productName={product.name}
            activeIndex={activeImage}
            onSelect={setActiveImage}
            onError={() => setImageError(true)}
            categorySlug={product.category?.slug}
          />

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-10">
            <ProductInfoHeader category={product.category} brand={product.brand} name={product.name} rating={product.rating} numReviews={product.numReviews} />
            <ProductPricing price={product.price} discountPrice={product.discountPrice} productId={product._id} />
            <ProductCartActions
              stock={product.stock} quantity={quantity} onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart} isInWishlist={isInWishlist(product._id)}
              onToggleWishlist={() => toggleWishlist(product._id)}
              productId={product._id} productName={product.name} productImage={product.images?.[0]}
            />
            <ProductTrustBadges productId={product._id} productName={product.name} currentPrice={product.price} />
          </motion.div>
        </div>

        <ProductDescriptionSection description={product.description} tags={product.tags} shippingOptions={product.shippingOptions} />

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }} className="mt-32 pt-32 border-t border-border/50">
          <ReviewSection productId={product._id} reviews={product.reviews} onReviewSubmit={refetch} />
        </motion.div>

        <div id="recently-viewed" className="mt-20 pt-20 border-t border-border/50">
          <RecentlyViewedProducts title="Recently Viewed" maxProducts={6} showClearButton />
        </div>
      </div>
    </div>
  );
}
