"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  ReportsHeader,
  ReportGeneratorDialog,
  ReportsList,
} from "@/components/admin/reports";
import type { Report } from "@/modules/admin/types";

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch reports");
      setReports(json.reports || json.data || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch reports");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete report");
      toast.success("Report deleted successfully");
      fetchReports();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete report");
      }
    }
  }, [fetchReports]);

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <ReportsHeader onGenerate={() => setDialogOpen(true)} />

      <ReportsList
        reports={reports}
        onDelete={handleDelete}
        loading={loading}
      />

      <ReportGeneratorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchReports}
      />
    </div>
  );
}
