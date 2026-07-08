// app/products/page.tsx
"use client";

import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductFilter } from "@/components/products/ProductFilter";
import { useProductsPage } from "@/modules/products/hooks/use-products-page";
import { ProductsPageHeader } from "@/components/products/products-page/ProductsPageHeader";
import { ProductsPageContent } from "@/components/products/products-page/ProductsPageContent";

export default function ProductsPage() {
  const { products, categories, loading, view, setView, showMobileFilters, setShowMobileFilters, pagination, currentFilters, updateFilters, handlePageChange, handleSortChange } = useProductsPage();

  return (
    <div className="min-h-screen bg-background/95 selection:bg-primary/10 selection:text-primary">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs />

        <ProductsPageHeader
          total={pagination.total} view={view} sortBy={currentFilters.sortBy}
          onViewChange={setView} onSortChange={handleSortChange}
          onMobileFiltersToggle={() => setShowMobileFilters(!showMobileFilters)}
          showMobileFilters={showMobileFilters}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className={cn("lg:col-span-3 transition-all duration-300 lg:block", showMobileFilters ? "block" : "hidden")}>
            <ProductFilter categories={categories} initialFilters={currentFilters}
              onFilterChange={(newFilters) => updateFilters({ ...newFilters, page: 1 })} />
          </aside>
          <main className="lg:col-span-9 space-y-12">
            <ProductsPageContent products={products} loading={loading} view={view}
              pagination={pagination} currentFilters={currentFilters} onPageChange={handlePageChange} />
          </main>
        </div>
      </div>
    </div>
  );
}
