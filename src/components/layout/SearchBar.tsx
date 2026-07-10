"use client";

import { Search } from "lucide-react";
import { ProductSearch } from "@/components/products/ProductSearch";

export function SearchBar() {
  return (
    <div className="relative">
      <ProductSearch compact />
    </div>
  );
}
