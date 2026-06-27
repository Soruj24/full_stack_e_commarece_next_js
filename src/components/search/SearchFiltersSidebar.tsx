"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export interface FiltersState {
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  inStock: boolean;
}

interface SearchFiltersSidebarProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  categories: Array<{ _id: string; slug?: string; name: string }>;
  brands: Array<{ _id: string; slug?: string; name: string }>;
  showFilters: boolean;
}

export function SearchFiltersSidebar({
  filters,
  onFiltersChange,
  categories,
  brands,
  showFilters,
}: SearchFiltersSidebarProps) {
  const hasActiveFilters =
    filters.category ||
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.rating ||
    filters.inStock;

  const handleChange = (key: keyof FiltersState, value: string | boolean) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      inStock: false,
    });
  };

  return (
    <aside
      className={`w-full md:w-64 flex-shrink-0 ${
        showFilters ? "block" : "hidden md:block"
      }`}
    >
      <div className="bg-card border rounded-2xl p-6 sticky top-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Filters</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              Reset
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <FilterSelect
            label="Category"
            value={filters.category}
            onChange={(value) => handleChange("category", value)}
            placeholder="All Categories"
          >
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat.slug ?? ""}>
                {cat.name}
              </SelectItem>
            ))}
          </FilterSelect>

          <FilterSelect
            label="Brand"
            value={filters.brand}
            onChange={(value) => handleChange("brand", value)}
            placeholder="All Brands"
          >
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand._id} value={brand.slug ?? ""}>
                {brand.name}
              </SelectItem>
            ))}
          </FilterSelect>

          <PriceRangeFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onMinChange={(value) => handleChange("minPrice", value)}
            onMaxChange={(value) => handleChange("maxPrice", value)}
          />

          <FilterSelect
            label="Rating"
            value={filters.rating}
            onChange={(value) => handleChange("rating", value)}
            placeholder="All Ratings"
          >
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="2">2+ Stars</SelectItem>
          </FilterSelect>

          <InStockFilter
            checked={filters.inStock}
            onChange={(checked) => handleChange("inStock", checked)}
          />
        </div>
      </div>
    </aside>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  placeholder,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}

function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}: {
  minPrice: string;
  maxPrice: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Price Range</label>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => onMinChange(e.target.value)}
          className="h-10"
        />
        <Input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => onMaxChange(e.target.value)}
          className="h-10"
        />
      </div>
    </div>
  );
}

function InStockFilter({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-input"
        />
        <span className="text-sm font-medium">In Stock Only</span>
      </label>
    </div>
  );
}
