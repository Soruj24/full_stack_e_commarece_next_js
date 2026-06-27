import { useState, useEffect } from "react";
import { toast } from "sonner";
import { IProduct } from "@/models/Product";
import { ICategory } from "@/types";

export function useAdminInventory() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  const fetchInventory = async (page = 1, search = keyword) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${page}&limit=${pagination.limit}&keyword=${search}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setPagination(prev => ({ ...prev, page: data.pagination.page, total: data.pagination.total, pages: data.pagination.pages }));
      }
    } catch { toast.error("Failed to fetch inventory"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchInventory(1, keyword), 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handlePageChange = (newPage: number) => fetchInventory(newPage, keyword);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast.success("Product deleted"); fetchInventory(pagination.page); }
    } catch { toast.error("Failed to delete product"); }
  };

  const handleAddProduct = () => { setSelectedProduct(null); setIsDialogOpen(true); };

  const lowStockProducts = products.filter((p: IProduct) => p.stock <= 10 && p.stock > 0);
  const outOfStockProducts = products.filter((p: IProduct) => p.stock === 0);

  const mapToDialogProduct = (p: IProduct | null) => {
    if (!p) return null;
    return {
      _id: String(p._id),
      name: p.name,
      description: p.description,
      price: p.price,
      category: typeof p.category === "object" && p.category !== null
        ? { _id: String((p.category as unknown as ICategory)._id), name: (p.category as unknown as ICategory).name || "Uncategorized", slug: (p.category as unknown as ICategory).slug || "" }
        : { _id: "", name: "Uncategorized", slug: "" },
      stock: p.stock,
      brand: p.brand,
      sku: p.sku,
      images: p.images,
    };
  };

  return {
    products, loading, keyword, setKeyword, selectedProduct, setSelectedProduct,
    isDialogOpen, setIsDialogOpen, pagination, fetchInventory,
    handlePageChange, handleDelete, handleAddProduct,
    lowStockProducts, outOfStockProducts, mapToDialogProduct,
  };
}
