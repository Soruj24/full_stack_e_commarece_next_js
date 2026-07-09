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
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "generating":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border/50 rounded-[48px] p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading reports...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-[48px] p-12 text-center">
        <p className="text-muted-foreground">No reports found</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden">
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
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report._id}>
                <TableCell className="font-bold">{report.name}</TableCell>
                <TableCell className="capitalize">{report.type}</TableCell>
                <TableCell className="text-muted-foreground">{report.config.dateRange}</TableCell>
                <TableCell className="uppercase font-bold text-xs">{report.config.format}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadge(report.status)}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(report.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {report.status === "ready" && report.fileUrl && (
                      <a href={report.fileUrl} download>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-destructive hover:text-destructive"
                      onClick={() => onDelete(report._id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
