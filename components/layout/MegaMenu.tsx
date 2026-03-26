"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  ShoppingBag, 
  Smartphone, 
  Watch, 
  Headphones, 
  Camera, 
  Gamepad2, 
  Laptop, 
  Shirt, 
  Gem, 
  Home,
  Layers,
  ChevronRight,
  Star,
  Sparkles,
  Tag,
  Percent,
  Package
} from "lucide-react";
import { ICategory } from "@/types";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  laptop: <Laptop className="w-5 h-5" />,
  phones: <Smartphone className="w-5 h-5" />,
  watches: <Watch className="w-5 h-5" />,
  headphones: <Headphones className="w-5 h-5" />,
  camera: <Camera className="w-5 h-5" />,
  gamepad: <Gamepad2 className="w-5 h-5" />,
  shirt: <Shirt className="w-5 h-5" />,
  default: <ShoppingBag className="w-5 h-5" />,
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  laptop: "from-blue-500 to-cyan-500",
  phones: "from-purple-500 to-pink-500",
  watches: "from-orange-500 to-red-500",
  headphones: "from-green-500 to-emerald-500",
  camera: "from-yellow-500 to-orange-500",
  gamepad: "from-indigo-500 to-violet-500",
  shirt: "from-pink-500 to-rose-500",
  default: "from-primary to-purple-500",
};

const FEATURED_PRODUCTS = [
  {
    name: "Wireless Headphones Pro Max",
    price: 199,
    originalPrice: 299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    badge: "Best Seller"
  },
  {
    name: "Smart Watch Ultra Series",
    price: 449,
    originalPrice: 599,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    badge: "New"
  },
  {
    name: "Premium Laptop Pro 16",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1496181133206-85ce1e5e9b8f?w=300&h=300&fit=crop",
    badge: "-20%"
  },
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories?active=true&sortBy=order");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const featuredCategories = categories.filter((c) => c.isFeatured).slice(0, 4);
  const otherCategories = categories.filter((c) => !c.isFeatured).slice(0, 8);

  const getIcon = (iconName?: string) => {
    return iconName ? CATEGORY_ICONS[iconName] || CATEGORY_ICONS.default : CATEGORY_ICONS.default;
  };

  const getGradient = (iconName?: string) => {
    return iconName ? CATEGORY_GRADIENTS[iconName] || CATEGORY_GRADIENTS.default : CATEGORY_GRADIENTS.default;
  };

  const getCategoryChildren = (categoryId: string) => {
    return categories.filter((c) => {
      const parent = c.parent;
      if (typeof parent === "object" && parent !== null) {
        return (parent as ICategory)._id === categoryId;
      }
      return parent === categoryId;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-50"
          >
            <div className="bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-2xl shadow-black/10">
              <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-12 gap-8">
                  {/* Featured Categories - Left */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                        Featured
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {featuredCategories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/products?category=${cat.slug}`}
                          onClick={onClose}
                          className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-all duration-300"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient(cat.icon)} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                            <div className="text-white">
                              {getIcon(cat.icon)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm group-hover:text-primary transition-colors">
                              {cat.name}
                            </p>
                            {cat.description && (
                              <p className="text-[10px] text-muted-foreground truncate">
                                {cat.description}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* All Categories - Center */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-2 mb-6">
                      <Layers className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        All Categories
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {otherCategories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/products?category=${cat.slug}`}
                          onClick={onClose}
                          className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200"
                          onMouseEnter={() => setHoveredCategory(cat._id)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <span className="text-muted-foreground group-hover:text-primary transition-colors">
                              {getIcon(cat.icon)}
                            </span>
                          </div>
                          <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                    
                    <Link
                      href="/categories"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 mt-6 p-3 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-wider">
                        View All Categories
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  </div>

                  {/* Featured Products - Right */}
                  <div className="col-span-5">
                    <div className="flex items-center gap-2 mb-6">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-600 dark:text-yellow-500">
                        Trending Now
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {FEATURED_PRODUCTS.map((product, idx) => (
                        <motion.div
                          key={product.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Link
                            href="/products"
                            onClick={onClose}
                            className="group block bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                          >
                            <div className="relative aspect-square overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 rounded-full bg-primary/90 text-[9px] font-black uppercase text-primary-foreground">
                                  {product.badge}
                                </span>
                              </div>
                            </div>
                            <div className="p-3">
                              <p className="text-[11px] font-bold line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-primary">
                                  ${product.price}
                                </span>
                                <span className="text-[10px] text-muted-foreground line-through">
                                  ${product.originalPrice}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Promo Banner */}
                <div className="mt-8 pt-6 border-t border-border/50">
                  <div className="grid grid-cols-3 gap-4">
                    <Link
                      href="/products?sort=newest"
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/20 hover:border-green-500/40 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <Gem className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-green-600 dark:text-green-500">New Arrivals</p>
                        <p className="text-[10px] text-muted-foreground">Fresh picks daily</p>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto text-green-500 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/products?sort=bestselling"
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border border-yellow-500/20 hover:border-yellow-500/40 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Home className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-yellow-600 dark:text-yellow-500">Best Sellers</p>
                        <p className="text-[10px] text-muted-foreground">Most loved items</p>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto text-yellow-500 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/products?sale=true"
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 border border-red-500/20 hover:border-red-500/40 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Percent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-500">On Sale</p>
                        <p className="text-[10px] text-muted-foreground">Up to 70% off</p>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto text-red-500 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
