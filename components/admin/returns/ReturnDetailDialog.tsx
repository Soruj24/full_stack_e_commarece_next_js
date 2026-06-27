"use client";

import { RefreshCw, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatReturnDate } from "@/features/returns/types/return-item";
import type { ReturnRequest } from "@/features/returns/types/return-item";

interface ReturnDetailDialogProps {
  selectedReturn: ReturnRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionLoading: boolean;
  adminNote: string;
  refundAmount: string;
  onNoteChange: (v: string) => void;
  onRefundAmountChange: (v: string) => void;
  onAction: (action: string) => void;
}

export function ReturnDetailDialog({ selectedReturn, open, onOpenChange, actionLoading, adminNote, refundAmount, onNoteChange, onRefundAmountChange, onAction }: ReturnDetailDialogProps) {
  if (!selectedReturn) return null;

  const appendRefundAmount = refundAmount || selectedReturn.refundAmount.toString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Return Request Details</DialogTitle>
          <DialogDescription>Order #{selectedReturn.orderId?.orderNumber} | {formatReturnDate(selectedReturn.createdAt)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">{selectedReturn.userId?.name}</p>
              <p className="text-sm">{selectedReturn.userId?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Refund Amount</p>
              <p className="text-2xl font-bold text-green-600">${selectedReturn.refundAmount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground capitalize">{selectedReturn.refundMethod.replace("_", " ")}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Reason</p>
            <p className="font-medium">{selectedReturn.reason}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Items</p>
            <div className="space-y-2">
              {selectedReturn.items.map((item, idx) => (
                <div key={idx} className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedReturn.notes.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">History</p>
              <div className="space-y-1 text-sm">
                {selectedReturn.notes.map((note, idx) => (
                  <p key={idx} className="text-muted-foreground">
                    <span className="capitalize font-medium text-foreground">{note.by}: </span>{note.message}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4 space-y-3">
            <Label>Add Note (optional)</Label>
            <Textarea placeholder="Add a note..." value={adminNote} onChange={(e) => onNoteChange(e.target.value)} />

            {selectedReturn.status === "received" && (
              <div>
                <Label>Refund Amount</Label>
                <Input type="number" value={appendRefundAmount} onChange={(e) => onRefundAmountChange(e.target.value)} className="mt-1" />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2">
          {selectedReturn.status === "pending" && (
            <>
              <Button variant="destructive" onClick={() => onAction("rejected")} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}Reject
              </Button>
              <Button onClick={() => onAction("approved")} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}Approve
              </Button>
            </>
          )}
          {selectedReturn.status === "approved" && (
            <Button onClick={() => onAction("received")} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}Mark Received
            </Button>
          )}
          {selectedReturn.status === "received" && (
            <Button onClick={() => onAction("refunded")} disabled={actionLoading} className="bg-green-600 hover:bg-green-700">
              {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}Process Refund
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
