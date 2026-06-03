"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Vendor } from "@/types/vendor";
import { fetchVendors, updateVendorStatus } from "@/lib/services/vendor-service";

export function useAdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadVendors = useCallback(async () => {
    setLoading(true);
    const data = await fetchVendors(statusFilter);
    setVendors(data);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const handleAction = useCallback(
    async (action: string, vendor: Vendor) => {
      setActionLoading(true);
      try {
        const data = await updateVendorStatus(
          vendor._id,
          action,
          action === "rejected" ? rejectReason : undefined
        );

        if (data.success) {
          toast.success(`Vendor ${action} successfully`);
          setDetailOpen(false);
          setRejectReason("");
          loadVendors();
        } else {
          toast.error(data.error);
        }
      } catch {
        toast.error("Failed to process action");
      } finally {
        setActionLoading(false);
      }
    },
    [rejectReason, loadVendors]
  );

  const filteredVendors = useMemo(
    () =>
      vendors.filter(
        (v) =>
          v.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [vendors, searchQuery]
  );

  const statusCounts = useMemo(
    () =>
      vendors.reduce(
        (acc, v) => {
          acc[v.status] = (acc[v.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    [vendors]
  );

  const openDetail = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setRejectReason("");
  }, []);

  return {
    vendors,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedVendor,
    detailOpen,
    rejectReason,
    setRejectReason,
    actionLoading,
    filteredVendors,
    statusCounts,
    handleAction,
    openDetail,
    closeDetail,
  };
}
