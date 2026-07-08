"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface BannerData {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type: string;
  isActive: boolean;
}

export function useBannerDialog(banner: { _id: string; title: string; subtitle?: string; image: string; link?: string; type: string; isActive: boolean } | null | undefined, open: boolean, onSuccess: () => void, onOpenChange: (open: boolean) => void) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BannerData>({ title: "", subtitle: "", image: "", link: "", type: "promotion", isActive: true });

  useEffect(() => {
    if (banner) setFormData({ title: banner.title, subtitle: banner.subtitle || "", image: banner.image, link: banner.link || "", type: banner.type, isActive: banner.isActive });
    else setFormData({ title: "", subtitle: "", image: "", link: "", type: "promotion", isActive: true });
  }, [banner, open]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = banner ? `/api/admin/marketing/banners/${banner._id}` : "/api/admin/marketing/banners";
      const method = banner ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { toast.success(banner ? "Banner updated" : "Banner created"); onSuccess(); onOpenChange(false); }
      else toast.error(data.error);
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  }, [banner, formData, onSuccess, onOpenChange]);

  return { loading, formData, setFormData, handleSubmit };
}
