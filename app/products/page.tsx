// app/products/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilter } from "@/components/products/ProductFilter";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Skeleton } from "@/components/ui/skeleton";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { ClientOnly } from "@/components/common/ClientOnly";

const ProductSkeleton = () => (
  <div className="bg-card rounded-[32px] border border-border/50 overflow-hidden p-6 space-y-4">
    <Skeleton className="aspect-square rounded-2xl w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="flex items-center justify-between pt-4">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-10 w-32 rounded-2xl" />
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProduct } from "@/types";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  // Extract filters from URL
  const currentFilters = useMemo(
    () => ({
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      rating: searchParams.get("rating") || "",
      sortBy: searchParams.get("sortBy") || "newest",
      page: searchParams.get("page") || "1",
      inStock: searchParams.get("inStock") || "false",
    }),
    [searchParams],
  );

  const updateFilters = useCallback(
    (newFilters: Record<string, string | number | boolean>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });

      // Reset to page 1 when filters change (unless only page changed)
      if (!newFilters.page) {
        params.delete("page");
      }

      router.push(`/products?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        if (catData.success) setCategories(catData.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?${searchParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ sortBy: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background/95 selection:bg-primary/10 selection:text-primary">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-foreground">
              Explore Our <span className="text-primary">Products</span>
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-muted-foreground font-medium text-lg">
                Curated collection of high-quality items for your needs.
              </p>
              {pagination.total > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {pagination.total} Items Found
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-card border border-border/50 p-2 rounded-[24px] shadow-xl shadow-primary/5">
            <div className="flex p-1 bg-muted/50 rounded-2xl">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView("grid")}
                className={cn(
                  "rounded-xl transition-all",
                  view === "grid"
                    ? "bg-background shadow-md text-primary"
                    : "text-muted-foreground",
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView("list")}
                className={cn(
                  "rounded-xl transition-all",
                  view === "list"
                    ? "bg-background shadow-md text-primary"
                    : "text-muted-foreground",
                )}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden rounded-2xl gap-2 font-bold border-border/50"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </Button>
            <div className="hidden lg:block h-8 w-px bg-border/50 mx-2" />
            <div className="hidden lg:flex items-center gap-3 px-2">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                Sorted By:
              </span>
              <ClientOnly>
                <Select
                  value={currentFilters.sortBy}
                  onValueChange={(value) =>
                    handleSortChange({
                      target: { value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                >
                  <SelectTrigger className="w-[180px] h-10 rounded-xl font-bold border-border/50 bg-background/50 backdrop-blur-sm focus:ring-primary/20">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 font-medium">
                    <SelectItem value="newest" className="cursor-pointer">
                      Newest First
                    </SelectItem>
                    <SelectItem value="price-asc" className="cursor-pointer">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc" className="cursor-pointer">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating" className="cursor-pointer">
                      Top Rated
                    </SelectItem>
                  </SelectContent>
                </Select>
              </ClientOnly>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Filters */}
          <aside
            className={cn(
              "lg:col-span-3 transition-all duration-300 lg:block",
              showMobileFilters ? "block" : "hidden",
            )}
          >
            <ProductFilter
              categories={categories}
              initialFilters={currentFilters}
              onFilterChange={(newFilters) =>
                updateFilters({ ...newFilters, page: 1 })
              }
            />
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-9 space-y-12">
            {loading ? (
              <div
                className={cn(
                  "grid gap-8",
                  view === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1",
                )}
              >
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (products || []).length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  key={pagination.page + JSON.stringify(currentFilters)}
                  className={cn(
                    "grid gap-8",
                    view === "grid"
                      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1",
                  )}
                >
                  {(products || []).map((product: IProduct) => (
                    <motion.div key={product._id} variants={itemVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                <ProfessionalPagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[50vh] bg-card/50 rounded-[40px] border-2 border-dashed border-border/50 p-12 text-center">
                <div className="p-6 bg-muted rounded-full mb-6">
                  <SlidersHorizontal className="w-12 h-12 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground font-medium max-w-sm">
                  We couldn&apos;t find any products matching your current filters.
                  Try adjusting your search or resetting filters.
                </p>
                <Button
                  variant="default"
                  className="mt-8 rounded-2xl px-8 font-black shadow-xl shadow-primary/20"
                  onClick={() => router.push("/products")}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
