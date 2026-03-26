"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AuditLogsHeader } from "@/components/admin/audit-logs/AuditLogsHeader";
import { AuditLogsTable } from "@/components/admin/audit-logs/AuditLogsTable";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { IAuditLog } from "@/types";

export default function AuditLogsPage() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/audit-logs?page=${page}&limit=${pagination.limit}&action=${actionFilter}&entity=${entityFilter}`
      );
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
        setPagination((prev) => ({
          ...prev,
          page: data.pagination?.page || 1,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      }
    } catch {
      toast.error("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      redirect("/login");
    }
    fetchLogs();
  }, [session, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [actionFilter, entityFilter]);

  const handlePageChange = (newPage: number) => {
    fetchLogs(newPage);
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
        <AuditLogsHeader
          loading={loading}
          onRefresh={() => fetchLogs(pagination.page)}
        />

        <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <div className="flex flex-col md:flex-row gap-4">
              <select
                className="w-full md:w-[200px] h-10 px-3 rounded-md border border-input bg-background"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="all">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
              </select>
              <select
                className="w-full md:w-[200px] h-10 px-3 rounded-md border border-input bg-background"
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
              >
                <option value="all">All Entities</option>
                <option value="User">User</option>
                <option value="Product">Product</option>
                <option value="Order">Order</option>
                <option value="Category">Category</option>
                <option value="Brand">Brand</option>
                <option value="Banner">Banner</option>
                <option value="Coupon">Coupon</option>
              </select>
            </div>
          </div>

          <AuditLogsTable logs={logs} loading={loading} />

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
