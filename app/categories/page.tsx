"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ICategory } from "@/types";
import { ShoppingBag, Smartphone, Watch, Headphones, Camera, Gamepad2, Laptop, Shirt, ArrowRight, Loader2 } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  laptop: <Laptop className="w-8 h-8" />,
  phones: <Smartphone className="w-8 h-8" />,
  watches: <Watch className="w-8 h-8" />,
  headphones: <Headphones className="w-8 h-8" />,
  camera: <Camera className="w-8 h-8" />,
  gamepad: <Gamepad2 className="w-8 h-8" />,
  shirt: <Shirt className="w-8 h-8" />,
  default: <ShoppingBag className="w-8 h-8" />,
};

const categoryGradients: Record<string, string> = {
  laptop: "from-blue-500 to-cyan-500",
  phones: "from-purple-500 to-pink-500",
  watches: "from-orange-500 to-red-500",
  headphones: "from-green-500 to-emerald-500",
  camera: "from-yellow-500 to-orange-500",
  gamepad: "from-indigo-500 to-violet-500",
  shirt: "from-pink-500 to-rose-500",
  default: "from-primary to-purple-500",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories?active=true&sortBy=order");
        const data = await res.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const featuredCategories = categories.filter((c) => c.isFeatured);
  const otherCategories = categories.filter((c) => !c.isFeatured);

  const getCategoryIcon = (icon?: string) => {
    return icon ? categoryIcons[icon] || categoryIcons.default : categoryIcons.default;
  };

  const getCategoryGradient = (icon?: string) => {
    return icon ? categoryGradients[icon] || categoryGradients.default : categoryGradients.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6">
            <ShoppingBag className="w-4 h-4" />
            Browse Categories
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Category</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of products across different categories. Find exactly what you&apos;re looking for.
          </p>
        </motion.div>

        {featuredCategories.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Featured Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/products?category=${category.slug}`}>
                    <div className="group relative h-72 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(category.icon)}`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${getCategoryGradient(category.icon)} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                          <div className="text-white">
                            {getCategoryIcon(category.icon)}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                        {category.description && (
                          <p className="text-white/70 text-sm line-clamp-2">{category.description}</p>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {otherCategories.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">More Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/products?category=${category.slug}`}>
                    <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryGradient(category.icon)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <div className="text-white">
                          {getCategoryIcon(category.icon)}
                        </div>
                      </div>
                      <h3 className="font-bold mb-1">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {categories.length === 0 && !loading && (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No categories available</h3>
            <p className="text-muted-foreground">Check back later for our product categories.</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-primary to-purple-500 rounded-[32px] p-10 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Use our search feature to find exactly what you need, or browse all products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="secondary" className="rounded-xl font-bold">
                Browse All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
