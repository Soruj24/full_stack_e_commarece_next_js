"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Coupon } from "@/types";
import { CouponsHeader } from "@/components/admin/coupons/CouponsHeader";
import { CouponsStats } from "@/components/admin/coupons/CouponsStats";
import { CouponsSearch } from "@/components/admin/coupons/CouponsSearch";
import { CouponsTable } from "@/components/admin/coupons/CouponsTable";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { AdminCouponDialog } from "@/components/admin/coupons/AdminCouponDialog";

export default function CouponsPage() {
  const { data: session, status } = useSession();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchCoupons = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/marketing/coupons?page=${page}&limit=${pagination.limit}&search=${searchQuery}`
      );
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
        setPagination((prev) => ({
          ...prev,
          page: data.pagination?.page || 1,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      }
    } catch {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      redirect("/login");
    }
    fetchCoupons();
  }, [session, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCoupons(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, typeFilter]);

  const handlePageChange = (newPage: number) => {
    fetchCoupons(newPage);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/marketing/coupons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Coupon deleted");
        fetchCoupons(pagination.page);
      }
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || coupon.discountType === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.isActive).length,
    percentage: coupons.filter((c) => c.discountType === "percentage").length,
    fixed: coupons.filter((c) => c.discountType === "fixed").length,
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <CouponsHeader
          loading={loading}
          onRefresh={() => fetchCoupons(pagination.page)}
          onAddCoupon={() => {
            setSelectedCoupon(null);
            setIsDialogOpen(true);
          }}
        />

        <CouponsStats stats={stats} />

        <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden">
          <CouponsSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />

          <CouponsTable
            coupons={filteredCoupons}
            loading={loading}
            onEdit={(coupon) => {
              setSelectedCoupon(coupon);
              setIsDialogOpen(true);
            }}
            onDelete={handleDelete}
            onToggleActive={(coupon) => {
              fetch(`/api/admin/marketing/coupons/${coupon._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !coupon.isActive }),
              }).then(() => fetchCoupons(pagination.page));
            }}
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

      <AdminCouponDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        coupon={selectedCoupon}
        onSuccess={() => fetchCoupons(pagination.page)}
      />
    </div>
  );
}
