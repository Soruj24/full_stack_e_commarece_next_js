"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  trackEvent,
  ANALYTICS_CATEGORIES,
  ANALYTICS_ACTIONS,
} from "@/lib/analytics";
import { useLocalization } from "@/context/LocalizationContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCardImage } from "./product-card/ProductCardImage";
import { ProductCardInfo } from "./product-card/ProductCardInfo";
import { IProduct } from "@/types";
import { getSafeImageSrc } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(() => {
    return getSafeImageSrc(product.images?.[0], product.category?.slug);
  });
  const { currency, t } = useLocalization();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Calculate discount if discountPrice exists
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-card rounded-[32px] border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
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
}
