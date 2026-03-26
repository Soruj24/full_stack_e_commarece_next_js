"use client";

import { useState, useEffect } from "react";
import { Store, Search, Loader2, Check, X, Eye, MoreHorizontal, AlertTriangle } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface Vendor {
  _id: string;
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  status: string;
  commissionRate: number;
  commissionBalance: number;
  totalEarnings: number;
  totalSales: number;
  contactEmail: string;
  userId: { _id: string; name: string; email: string };
  createdAt: string;
  rejectedReason?: string;
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== "all" ? `/api/vendors?status=${statusFilter}` : "/api/vendors";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setVendors(data.vendors);
      }
    } catch {
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [statusFilter]);

  const handleAction = async (action: string, vendor: Vendor) => {
    setActionLoading(true);
    try {
      const body: Record<string, unknown> = { status: action };
      if (action === "rejected" && rejectReason) {
        body.rejectedReason = rejectReason;
      }

      const res = await fetch(`/api/vendors/${vendor._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Vendor ${action} successfully`);
        setDetailOpen(false);
        setRejectReason("");
        fetchVendors();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to process action");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusCounts = vendors.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">Manage vendor applications</p>
        </div>
        {statusCounts.pending > 0 && (
          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
            {statusCounts.pending} pending applications
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { status: "all", label: "All", count: vendors.length },
          { status: "pending", label: "Pending", color: "text-yellow-600" },
          { status: "approved", label: "Approved", color: "text-green-600" },
          { status: "rejected", label: "Rejected", color: "text-red-600" },
        ].map((item) => (
          <Card key={item.status} className="cursor-pointer hover:shadow-md" onClick={() => setStatusFilter(item.status)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <Badge variant="outline" className={cn("font-bold", item.color)}>
                  {statusCounts[item.status] || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Vendors</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
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
                  <TableHead>Store</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No vendors found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendors.map((vendor) => (
                    <TableRow key={vendor._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Store className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{vendor.storeName}</p>
                            <p className="text-xs text-muted-foreground">/{vendor.storeSlug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{vendor.userId?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{vendor.userId?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{vendor.commissionRate}%</TableCell>
                      <TableCell className="font-medium text-green-600">${vendor.totalEarnings.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            vendor.status === "approved" && "text-green-600 border-green-300",
                            vendor.status === "pending" && "text-yellow-600 border-yellow-300",
                            vendor.status === "rejected" && "text-red-600 border-red-300",
                            vendor.status === "suspended" && "text-gray-600 border-gray-300"
                          )}
                        >
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(vendor.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedVendor(vendor); setDetailOpen(true); }}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {vendor.status === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleAction("approved", vendor)}>
                                  <Check className="w-4 h-4 mr-2 text-green-600" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setSelectedVendor(vendor); setDetailOpen(true); }}>
                                  <X className="w-4 h-4 mr-2 text-red-600" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {vendor.status === "approved" && (
                              <DropdownMenuItem onClick={() => handleAction("suspended", vendor)}>
                                <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          {selectedVendor && (
            <>
              <DialogHeader>
                <DialogTitle>Vendor Details</DialogTitle>
                <DialogDescription>{selectedVendor.storeName}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Store Name</p>
                    <p className="font-medium">{selectedVendor.storeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Slug</p>
                    <p className="font-medium">/{selectedVendor.storeSlug}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="font-medium">{selectedVendor.userId?.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedVendor.userId?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{selectedVendor.contactEmail}</p>
                  </div>
                </div>

                {selectedVendor.storeDescription && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p>{selectedVendor.storeDescription}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Commission</p>
                    <p className="text-xl font-bold">{selectedVendor.commissionRate}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Earnings</p>
                    <p className="text-xl font-bold text-green-600">${selectedVendor.totalEarnings.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Sales</p>
                    <p className="text-xl font-bold">{selectedVendor.totalSales}</p>
                  </div>
                </div>

                {selectedVendor.status === "pending" && (
                  <div className="space-y-2">
                    <Label>Rejection Reason (if rejecting)</Label>
                    <Textarea
                      placeholder="Enter reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                )}

                {selectedVendor.rejectedReason && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200">
                    <p className="text-sm text-muted-foreground">Rejection Reason</p>
                    <p className="font-medium text-red-600">{selectedVendor.rejectedReason}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-wrap gap-2">
                {selectedVendor.status === "pending" && (
                  <>
                    <Button variant="destructive" onClick={() => handleAction("rejected", selectedVendor)} disabled={actionLoading}>
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button onClick={() => handleAction("approved", selectedVendor)} disabled={actionLoading}>
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
                {selectedVendor.status === "approved" && (
                  <Button variant="destructive" onClick={() => handleAction("suspended", selectedVendor)} disabled={actionLoading}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Suspend
                  </Button>
                )}
                {selectedVendor.status === "suspended" && (
                  <Button onClick={() => handleAction("approved", selectedVendor)} disabled={actionLoading}>
                    <Check className="w-4 h-4 mr-2" />
                    Reactivate
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
