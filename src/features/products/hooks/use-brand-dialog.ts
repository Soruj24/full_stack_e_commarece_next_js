"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface BrandData {
  name: string;
  description: string;
  logo: string;
  website: string;
  isActive: boolean;
}

export function useBrandDialog(brand: { _id: string; name: string; slug: string; description?: string; logo?: string; website?: string; isActive: boolean } | undefined, open: boolean, onSuccess: () => void, onOpenChange: (open: boolean) => void) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BrandData>({ name: "", description: "", logo: "", website: "", isActive: true });

  useEffect(() => {
    if (brand) setFormData({ name: brand.name, description: brand.description || "", logo: brand.logo || "", website: brand.website || "", isActive: brand.isActive });
    else setFormData({ name: "", description: "", logo: "", website: "", isActive: true });
  }, [brand, open]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = brand ? `/api/admin/brands/${brand._id}` : "/api/admin/brands";
      const method = brand ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { toast.success(brand ? "Brand updated" : "Brand created"); onSuccess(); onOpenChange(false); }
      else toast.error(data.error);
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  }, [brand, formData, onSuccess, onOpenChange]);

  return { loading, formData, setFormData, handleSubmit };
}
