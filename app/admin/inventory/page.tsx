"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminProductDialog } from "@/components/admin/AdminProductDialog";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { IProduct } from "@/models/Product";
import { ICategory } from "@/types";
import {
  InventoryHeader,
  InventoryStats,
  InventorySearch,
  InventoryTable,
} from "@/components/admin/inventory";

export default function InventoryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchInventory = async (page = 1, search = keyword) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products?page=${page}&limit=${pagination.limit}&keyword=${search}`,
      );
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setPagination((prev) => ({
          ...prev,
          page: data.pagination.page,
          total: data.pagination.total,
          pages: data.pagination.pages,
        }));
      }
    } catch {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory(1, keyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handlePageChange = (newPage: number) => {
    fetchInventory(newPage, keyword);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted");
        fetchInventory(pagination.page);
      }
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const lowStockProducts = products.filter(
    (p: IProduct) => p.stock <= 10 && p.stock > 0,
  );
  const outOfStockProducts = products.filter((p: IProduct) => p.stock === 0);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background/95 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <InventoryHeader
          loading={loading}
          onRefresh={() => fetchInventory(pagination.page)}
          onAddProduct={handleAddProduct}
        />

        <AdminProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          product={
            selectedProduct
              ? {
                  _id: String(selectedProduct._id),
                  name: selectedProduct.name,
                  description: selectedProduct.description,
                  price: selectedProduct.price,
                  category:
                    typeof selectedProduct.category === "object" &&
                    selectedProduct.category !== null
                      ? {
                          _id: String(
                            (selectedProduct.category as unknown as ICategory)
                              ._id,
                          ),
                          name:
                            (selectedProduct.category as unknown as ICategory)
                              .name || "Uncategorized",
                          slug:
                            (selectedProduct.category as unknown as ICategory)
                              .slug || "",
                        }
                      : { _id: "", name: "Uncategorized", slug: "" },
                  stock: selectedProduct.stock,
                  brand: selectedProduct.brand,
                  sku: selectedProduct.sku,
                  images: selectedProduct.images,
                }
              : null
          }
          onSuccess={() => fetchInventory(pagination.page)}
        />

        <InventoryStats
          totalProducts={products.length}
          lowStockCount={lowStockProducts.length}
          outOfStockCount={outOfStockProducts.length}
        />

        <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden">
          <InventorySearch
            value={keyword}
            onChange={setKeyword}
          />

          <InventoryTable
            products={products}
            loading={loading}
            onEdit={(product) => {
              setSelectedProduct(product);
              setIsDialogOpen(true);
            }}
            onDelete={handleDelete}
          />

          <div className="p-4 border-t border-border/50">
            <ProfessionalPagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}