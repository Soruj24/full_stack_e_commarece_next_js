"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Report } from "@/modules/admin/types";

interface ReportsListProps {
  reports: Report[];
  onDelete: (id: string) => void;
  loading: boolean;
}

export function ReportsList({ reports, onDelete, loading }: ReportsListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "generating":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border/60";
    }
  };

  if (loading) {
    return (
      <div className="border border-border/60 rounded-xl bg-card p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto" />
        <p className="text-sm text-muted-foreground mt-4">Loading reports...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="border border-border/60 rounded-xl bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">No reports found</p>
      </div>
    );
  }

  return (
    <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Generated At</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report._id}>
                <TableCell className="text-sm font-medium">{report.name}</TableCell>
                <TableCell className="text-sm capitalize">{report.type}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{report.config?.dateRange || "—"}</TableCell>
                <TableCell className="text-xs font-medium uppercase">{report.config?.format || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[11px] font-medium ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(report.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {report.status === "ready" && report.fileUrl && (
                      <a href={report.fileUrl} download>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => onDelete(report._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
