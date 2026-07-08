"use client";

import { X, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Vendor } from "@/modules/vendor/types/vendor";

interface VendorDetailDialogProps {
  open: boolean;
  vendor: Vendor | null;
  rejectReason: string;
  actionLoading: boolean;
  onRejectReasonChange: (reason: string) => void;
  onClose: () => void;
  onAction: (action: string, vendor: Vendor) => void;
}

export function VendorDetailDialog({
  open,
  vendor,
  rejectReason,
  actionLoading,
  onRejectReasonChange,
  onClose,
  onAction,
}: VendorDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        {vendor && (
          <>
            <DialogHeader>
              <DialogTitle>Vendor Details</DialogTitle>
              <DialogDescription>{vendor.storeName}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Store Name</p>
                  <p className="font-medium">{vendor.storeName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Slug</p>
                  <p className="font-medium">/{vendor.storeSlug}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="font-medium">{vendor.userId?.name}</p>
                  <p className="text-sm text-muted-foreground">{vendor.userId?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{vendor.contactEmail}</p>
                </div>
              </div>
              {vendor.storeDescription && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{vendor.storeDescription}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Commission</p>
                  <p className="text-xl font-bold">{vendor.commissionRate}%</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Earnings</p>
                  <p className="text-xl font-bold text-green-600">${vendor.totalEarnings.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Sales</p>
                  <p className="text-xl font-bold">{vendor.totalSales}</p>
                </div>
              </div>
              {vendor.status === "pending" && (
                <div className="space-y-2">
                  <Label>Rejection Reason (if rejecting)</Label>
                  <Textarea
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => onRejectReasonChange(e.target.value)}
                  />
                </div>
              )}
              {vendor.rejectedReason && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200">
                  <p className="text-sm text-muted-foreground">Rejection Reason</p>
                  <p className="font-medium text-red-600">{vendor.rejectedReason}</p>
                </div>
              )}
            </div>

            <DialogFooter className="flex-wrap gap-2">
              {vendor.status === "pending" && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => onAction("rejected", vendor)}
                    disabled={actionLoading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => onAction("approved", vendor)}
                    disabled={actionLoading}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
              {vendor.status === "approved" && (
                <Button
                  variant="destructive"
                  onClick={() => onAction("suspended", vendor)}
                  disabled={actionLoading}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Suspend
                </Button>
              )}
              {vendor.status === "suspended" && (
                <Button
                  onClick={() => onAction("approved", vendor)}
                  disabled={actionLoading}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Reactivate
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
