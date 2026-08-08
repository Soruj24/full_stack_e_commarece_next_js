"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  trackEvent,
  ANALYTICS_CATEGORIES,
  ANALYTICS_ACTIONS,
} from "@/lib/analytics";
import { useLocalization } from "@/modules/common/hooks/LocalizationContext";
import { useCart } from "@/modules/cart/context/CartContext";
import { useWishlist } from "@/modules/wishlist/hooks/WishlistContext";
import { ProductCardImage } from "./product-card/ProductCardImage";
import { ProductCardInfo } from "./product-card/ProductCardInfo";
import { IProduct } from "@/shared/types";
import { getSafeImageSrc } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(() => {
    return getSafeImageSrc(product.images?.[0], product.category?.slug);
  });
  const { currency, t } = useLocalization();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const hasDiscount =
    (product.discountPrice ?? 0) > 0 &&
    (product.discountPrice ?? 0) < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100,
      )
    : 0;

  const currentPrice = hasDiscount ? product.discountPrice! : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product._id,
      name: product.name,
      price: currentPrice,
      image: getSafeImageSrc(product.images?.[0], product.category?.slug),
      quantity: 1,
      stock: product.stock,
    });

    trackEvent({
      action: ANALYTICS_ACTIONS.ADD_TO_CART,
      category: ANALYTICS_CATEGORIES.ECOMMERCE,
      label: product.name,
      value: product.price,
      items: [
        {
          item_id: product._id,
          item_name: product.name,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  };

  const handleViewProduct = () => {
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-card rounded-2xl border border-border/60 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.08)] hover:shadow-black/5 dark:hover:shadow-black/20 hover:border-border"
    >
      <ProductCardImage
        product={product}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        hasDiscount={hasDiscount}
        discountPercentage={discountPercentage}
        isInWishlist={isInWishlist}
        toggleWishlist={toggleWishlist}
        handleAddToCart={handleAddToCart}
        handleViewProduct={handleViewProduct}
        t={t}
      />

      <ProductCardInfo
        product={product}
        hasDiscount={hasDiscount}
        currentPrice={currentPrice}
        currency={currency}
        handleAddToCart={handleAddToCart}
        t={t}
      />
    </motion.div>
  );
});
