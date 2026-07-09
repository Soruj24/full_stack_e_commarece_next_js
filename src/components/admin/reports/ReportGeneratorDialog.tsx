"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

interface ReportGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ReportGeneratorDialog({
  open,
  onOpenChange,
  onSuccess,
}: ReportGeneratorDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "sales",
    dateRange: "30d",
    format: "pdf",
    groupBy: "day",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate report");
      }

      toast.success("Report generation started!");
      onOpenChange(false);
      setFormData({ name: "", type: "sales", dateRange: "30d", format: "pdf", groupBy: "day" });
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[32px] bg-card border-border shadow-2xl">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-black text-center">
            Generate Report
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground font-medium">
            Configure the report parameters to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Report Name
              </Label>
              <Input
                placeholder="Monthly Sales Report"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 rounded-xl bg-muted/50 border-border focus:ring-primary font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Report Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border focus:ring-primary font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value="sales" className="font-bold">Sales</SelectItem>
                  <SelectItem value="revenue" className="font-bold">Revenue</SelectItem>
                  <SelectItem value="products" className="font-bold">Products</SelectItem>
                  <SelectItem value="customers" className="font-bold">Customers</SelectItem>
                  <SelectItem value="orders" className="font-bold">Orders</SelectItem>
                  <SelectItem value="inventory" className="font-bold">Inventory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                  Date Range
                </Label>
                <Select
                  value={formData.dateRange}
                  onValueChange={(v) => setFormData({ ...formData, dateRange: v })}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border focus:ring-primary font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-card">
                    <SelectItem value="today" className="font-bold">Today</SelectItem>
                    <SelectItem value="yesterday" className="font-bold">Yesterday</SelectItem>
                    <SelectItem value="7d" className="font-bold">Last 7 Days</SelectItem>
                    <SelectItem value="30d" className="font-bold">Last 30 Days</SelectItem>
                    <SelectItem value="90d" className="font-bold">Last 90 Days</SelectItem>
                    <SelectItem value="1y" className="font-bold">This Year</SelectItem>
                    <SelectItem value="custom" className="font-bold">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                  Format
                </Label>
                <Select
                  value={formData.format}
                  onValueChange={(v) => setFormData({ ...formData, format: v as "pdf" | "csv" | "excel" })}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border focus:ring-primary font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-card">
                    <SelectItem value="pdf" className="font-bold">PDF</SelectItem>
                    <SelectItem value="csv" className="font-bold">CSV</SelectItem>
                    <SelectItem value="excel" className="font-bold">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Group By
              </Label>
              <Select
                value={formData.groupBy}
                onValueChange={(v) => setFormData({ ...formData, groupBy: v })}
              >
                <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border focus:ring-primary font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value="day" className="font-bold">Day</SelectItem>
                  <SelectItem value="week" className="font-bold">Week</SelectItem>
                  <SelectItem value="month" className="font-bold">Month</SelectItem>
                  <SelectItem value="quarter" className="font-bold">Quarter</SelectItem>
                  <SelectItem value="year" className="font-bold">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl font-bold px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-2xl font-black px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
