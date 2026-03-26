"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Check, X, Eye, Loader2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReturnRequest {
  _id: string;
  orderId: { _id: string; orderNumber: string; totalAmount: number };
  userId: { _id: string; name: string; email: string };
  items: { name: string; quantity: number; price: number }[];
  status: string;
  reason: string;
  refundAmount: number;
  refundMethod: string;
  createdAt: string;
  notes: { by: string; message: string; createdAt: string }[];
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  approved: { label: "Approved", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  rejected: { label: "Rejected", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
  received: { label: "Received", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  refunded: { label: "Refunded", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
  cancelled: { label: "Cancelled", color: "text-gray-600", bgColor: "bg-gray-100 dark:bg-gray-900/30" },
};

export default function AdminReturnsPage() {
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
      if (data.success) {
        setReturns(data.returns);
      }
    } catch {
      toast.error("Failed to fetch returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [statusFilter]);

  const handleAction = async (action: string) => {
    if (!selectedReturn) return;
    setActionLoading(true);

    try {
      const body: Record<string, string> = { action };
      if (adminNote) body.note = adminNote;
      if (refundAmount) body.refundAmount = refundAmount;

      const res = await fetch(`/api/returns/${selectedReturn._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Return ${action} successfully`);
        setDetailOpen(false);
        setAdminNote("");
        setRefundAmount("");
        fetchReturns();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to process action");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredReturns = returns.filter((ret) =>
    ret.orderId?.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ret.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ret.reason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const statusCounts = returns.reduce((acc, ret) => {
    acc[ret.status] = (acc[ret.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pendingCount = statusCounts.pending || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Returns & Refunds</h1>
          <p className="text-muted-foreground">Manage return requests</p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
            {pendingCount} pending requests
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(status)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{config.label}</span>
                <Badge variant="outline" className={cn("font-bold", config.bgColor, config.color)}>
                  {statusCounts[status] || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Returns</CardTitle>
            <div className="flex gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No returns found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReturns.map((ret) => {
                    const config = statusConfig[ret.status] || statusConfig.pending;
                    return (
                      <TableRow key={ret._id}>
                        <TableCell className="font-medium">#{ret.orderId?.orderNumber || ret.orderId?._id?.slice(-6)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ret.userId?.name}</p>
                            <p className="text-xs text-muted-foreground">{ret.userId?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{ret.items.length} item(s)</TableCell>
                        <TableCell className="max-w-[150px] truncate">{ret.reason}</TableCell>
                        <TableCell className="font-bold text-green-600">${ret.refundAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(config.bgColor, config.color)}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(ret.createdAt)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedReturn(ret); setDetailOpen(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          {selectedReturn && (
            <>
              <DialogHeader>
                <DialogTitle>Return Request Details</DialogTitle>
                <DialogDescription>
                  Order #{selectedReturn.orderId?.orderNumber} | {formatDate(selectedReturn.createdAt)}
                </DialogDescription>
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
                          <span className="capitalize font-medium text-foreground">{note.by}: </span>
                          {note.message}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 space-y-3">
                  <Label>Add Note (optional)</Label>
                  <Textarea placeholder="Add a note..." value={adminNote} onChange={(e) => setAdminNote(e.target.value)} />

                  {selectedReturn.status === "received" && (
                    <div>
                      <Label>Refund Amount</Label>
                      <Input type="number" value={refundAmount || selectedReturn.refundAmount.toString()} onChange={(e) => setRefundAmount(e.target.value)} className="mt-1" />
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex-wrap gap-2">
                {selectedReturn.status === "pending" && (
                  <>
                    <Button variant="destructive" onClick={() => handleAction("rejected")} disabled={actionLoading}>
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button onClick={() => handleAction("approved")} disabled={actionLoading}>
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
                {selectedReturn.status === "approved" && (
                  <Button onClick={() => handleAction("received")} disabled={actionLoading}>
                    <Check className="w-4 h-4 mr-2" />
                    Mark Received
                  </Button>
                )}
                {selectedReturn.status === "received" && (
                  <Button onClick={() => handleAction("refunded")} disabled={actionLoading} className="bg-green-600 hover:bg-green-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Process Refund
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
