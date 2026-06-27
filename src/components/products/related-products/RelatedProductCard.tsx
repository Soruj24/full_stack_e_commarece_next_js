import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IProduct } from '@/lib/types';

interface RelatedProductCardProps {
  product: IProduct;
  index: number;
  isHovered: boolean;
  inWishlist: boolean;
  onHover: (id: string | null) => void;
  onAddToCart: (product: IProduct, e: React.MouseEvent) => void;
  onToggleWishlist: (product: IProduct, e: React.MouseEvent) => void;
}

export function RelatedProductCard({ product, index, isHovered, inWishlist, onHover, onAddToCart, onToggleWishlist }: RelatedProductCardProps) {
  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex-shrink-0 w-[260px]"
      onMouseEnter={() => onHover(product._id)}
      onMouseLeave={() => onHover(null)}
    >
      <Link href={`/products/${product._id}`} className="block group">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
          <Image src={product.images?.[0] || "/placeholder.png"} alt={product.name} fill
            className={cn("object-cover transition-transform duration-500", isHovered && "scale-110")} />

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isFeatured && <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg">Featured</span>}
            {discount > 0 && <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg">-{discount}%</span>}
          </div>

          <motion.div initial={false} animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="absolute top-3 right-3 flex flex-col gap-2">
            <button onClick={(e) => onToggleWishlist(product, e)}
              className={cn("w-9 h-9 rounded-full flex items-center justify-center transition-all",
                inWishlist ? "bg-red-500 text-white" : "bg-white/90 text-zinc-600 hover:bg-white hover:text-red-500")}>
              <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/90 text-zinc-600 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div initial={false} animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute bottom-3 left-3 right-3">
            <Button onClick={(e) => onAddToCart(product, e)} size="sm"
              className="w-full h-10 bg-white/95 hover:bg-white text-zinc-900 rounded-xl shadow-lg font-semibold">
              <ShoppingCart className="w-4 h-4 mr-2" />Quick Add
            </Button>
          </motion.div>

          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-4 py-2 bg-white text-sm font-bold rounded-xl">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{product.brand || product.category?.name}</p>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>

          {product.rating && product.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-3 h-3", i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-zinc-300")} />
                ))}
              </div>
              <span className="text-[10px] text-zinc-500">({product.numReviews || 0})</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">${(product.discountPrice || product.price).toFixed(2)}</span>
            {product.discountPrice && <span className="text-xs text-zinc-400 line-through">${product.price.toFixed(2)}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
