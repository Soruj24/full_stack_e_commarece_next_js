"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminBannerDialog } from "@/components/admin/AdminBannerDialog";
import { IBanner } from "@/types";
import {
  BannersHeader,
  BannerCard,
  BannersEmptyState,
} from "@/components/admin/marketing/banners";

export default function BannersPage() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState<IBanner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/marketing/banners");
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners);
      }
    } catch {
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/marketing/banners/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Banner deleted");
        fetchBanners();
      }
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  const handleAddBanner = () => {
    setSelectedBanner(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background/95 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <BannersHeader
          loading={loading}
          onRefresh={fetchBanners}
          onAddBanner={handleAddBanner}
        />

        <AdminBannerDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          banner={selectedBanner}
          onSuccess={fetchBanners}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner: IBanner) => (
            <BannerCard
              key={banner._id}
              banner={banner}
              onEdit={(b) => {
                setSelectedBanner(b);
                setIsDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
          <BannersEmptyState show={banners.length === 0 && !loading} />
        </div>
      </div>
    </div>
  );
}