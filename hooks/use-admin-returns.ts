import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { ReturnRequest } from "@/types/return-item";

export function useAdminReturns() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== "all" ? `/api/returns?status=${statusFilter}` : "/api/returns";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setReturns(data.returns);
    } catch { toast.error("Failed to fetch returns"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReturns(); }, [statusFilter]);

  const handleAction = async (action: string) => {
    if (!selectedReturn) return;
    setActionLoading(true);
    try {
      const body: Record<string, string> = { action };
      if (adminNote) body.note = adminNote;
      if (refundAmount) body.refundAmount = refundAmount;
      const res = await fetch(`/api/returns/${selectedReturn._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) {
        toast.success(`Return ${action} successfully`);
        setDetailOpen(false);
        setAdminNote("");
        setRefundAmount("");
        fetchReturns();
      } else toast.error(data.error);
    } catch { toast.error("Failed to process action"); }
    finally { setActionLoading(false); }
  };

  const filteredReturns = returns.filter((ret) =>
    ret.orderId?.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ret.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ret.reason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusCounts = returns.reduce((acc, ret) => {
    acc[ret.status] = (acc[ret.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    filteredReturns, loading, searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    selectedReturn, setSelectedReturn, detailOpen, setDetailOpen, actionLoading, adminNote, setAdminNote,
    refundAmount, setRefundAmount, handleAction, statusCounts,
  };
}
