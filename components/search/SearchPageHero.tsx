"use client";

import { SearchBar } from "@/components/search/SearchBar";

export function SearchPageHero() {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Search <span className="text-primary">Products</span>
          </h1>
          <p className="text-muted-foreground">
            Find exactly what you&apos;re looking for
          </p>
        </div>
        <SearchBar placeholder="Search for products, brands, categories..." />
      </div>
    </div>
  );
}
