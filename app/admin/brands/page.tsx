"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminBrandDialog } from "@/components/admin/AdminBrandDialog";
import {
  BrandsHeader,
  BrandsSearch,
  BrandCard,
  BrandsEmptyState,
} from "@/components/admin/brands";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      if (data.success) {
        setBrands(data.brands);
      }
    } catch {
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Brand deleted");
        fetchBrands();
      }
    } catch {
      toast.error("Failed to delete brand");
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddBrand = () => {
    setSelectedBrand(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background/95 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <BrandsHeader
          loading={loading}
          onRefresh={fetchBrands}
          onAddBrand={handleAddBrand}
        />

        <BrandsSearch
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBrands.map((brand) => (
            <BrandCard
              key={brand._id}
              brand={brand}
              onEdit={(b) => {
                setSelectedBrand(b);
                setIsDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}

          {filteredBrands.length === 0 && !loading && (
            <BrandsEmptyState />
          )}
        </div>

        <AdminBrandDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          brand={selectedBrand}
          onSuccess={fetchBrands}
        />
      </div>
    </div>
  );
}