import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import type { IProduct } from "@/shared/types";

interface AvailableProductsGridProps {
  products: IProduct[];
  onAddItem: (product: IProduct) => void;
}

export function AvailableProductsGrid({ products, onAddItem }: AvailableProductsGridProps) {
  return (
    <div className="p-6">
      <h3 className="text-sm font-semibold mb-4">Available Products ({products.length})</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.slice(0, 8).map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ scale: 1.02 }}
            className="relative bg-zinc-50 dark:bg-white/5 rounded-xl overflow-hidden group cursor-pointer"
            onClick={() => onAddItem(product)}
          >
            <div className="aspect-square relative">
              <Image src={product.images?.[0] || "/placeholder.png"} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="p-3">
              <h4 className="text-xs font-medium line-clamp-1">{product.name}</h4>
              <p className="text-xs font-bold text-primary mt-1">${(product.discountPrice || product.price).toFixed(2)}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {products.length > 8 && (
        <Link href="/products" className="flex items-center justify-center gap-2 mt-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
          View All Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
