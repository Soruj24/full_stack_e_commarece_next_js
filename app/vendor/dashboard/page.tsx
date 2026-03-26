"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Store, DollarSign, Package, ShoppingCart, TrendingUp, Star, ArrowUpRight, ArrowDownRight, Loader2, Clock, Check, X, AlertTriangle, Wallet, Send, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  pendingPayout: number;
  totalEarnings: number;
  totalSales: number;
  totalOrders: number;
  rating: number;
  numReviews: number;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
}

interface Payout {
  _id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  requestedAt: string;
  completedAt?: string;
}

export default function VendorDashboardPage() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("bank_transfer");
  const [requesting, setRequesting] = useState(false);

  const fetchVendor = async () => {
    try {
      const res = await fetch("/api/vendors");
      const data = await res.json();
      if (data.success && data.vendors?.length > 0) {
        setVendor(data.vendors[0]);
      }
    } catch {
      toast.error("Failed to load vendor data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayouts = async () => {
    try {
      const res = await fetch("/api/payouts");
      const data = await res.json();
      if (data.success) {
        setPayouts(data.payouts);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchVendor();
    fetchPayouts();
  }, []);

  const handlePayoutRequest = async () => {
    if (!vendor) return;
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > vendor.commissionBalance) {
      toast.error("Amount exceeds available balance");
      return;
    }

    setRequesting(true);
    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, paymentMethod: payoutMethod }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Payout request submitted!");
        setPayoutModalOpen(false);
        setPayoutAmount("");
        fetchVendor();
        fetchPayouts();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to submit payout request");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-2">No Vendor Account</h2>
          <p className="text-muted-foreground mb-4">Create a vendor account to start selling.</p>
          <Button asChild><Link href="/vendor/register">Register as Vendor</Link></Button>
        </Card>
      </div>
    );
  }

  if (vendor.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Application Under Review</h2>
          <p className="text-muted-foreground mb-4">
            Your vendor application for <strong>{vendor.storeName}</strong> is being reviewed. We&apos;ll notify you once it&apos;s approved.
          </p>
          <Button variant="outline" asChild><Link href="/">Return Home</Link></Button>
        </Card>
      </div>
    );
  }

  if (vendor.status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Application Rejected</h2>
          <p className="text-muted-foreground mb-4">Your vendor application was not approved.</p>
          <Button asChild><Link href="/vendor/register">Try Again</Link></Button>
        </Card>
      </div>
    );
  }

  const stats = [
    { label: "Total Earnings", value: `$${vendor.totalEarnings.toFixed(2)}`, icon: DollarSign, color: "text-green-600 bg-green-100" },
    { label: "Total Sales", value: vendor.totalSales.toString(), icon: ShoppingCart, color: "text-blue-600 bg-blue-100" },
    { label: "Total Orders", value: vendor.totalOrders.toString(), icon: Package, color: "text-purple-600 bg-purple-100" },
    { label: "Rating", value: `${vendor.rating.toFixed(1)} ⭐`, icon: Star, color: "text-yellow-600 bg-yellow-100" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{vendor.storeName}</h1>
            <p className="text-muted-foreground">Vendor Dashboard</p>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-300">
            <Check className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Earnings & Payouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200">
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold text-green-600">${vendor.commissionBalance.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200">
                  <p className="text-sm text-muted-foreground">Pending Payout</p>
                  <p className="text-2xl font-bold text-yellow-600">${vendor.pendingPayout.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted">
                  <p className="text-sm text-muted-foreground">Commission Rate</p>
                  <p className="text-2xl font-bold">{vendor.commissionRate}%</p>
                </div>
              </div>

              <Button className="w-full" onClick={() => setPayoutModalOpen(true)} disabled={vendor.commissionBalance <= 0}>
                <Send className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/products?vendor=true">
                  <Package className="w-4 h-4 mr-2" />
                  Manage Products
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/orders">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Orders
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/store/${vendor.storeSlug}`}>
                  <Store className="w-4 h-4 mr-2" />
                  View Store
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            {payouts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No payouts yet</p>
            ) : (
              <div className="space-y-3">
                {payouts.slice(0, 5).map((payout) => (
                  <div key={payout._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        payout.status === "completed" ? "bg-green-100" :
                        payout.status === "pending" ? "bg-yellow-100" : "bg-red-100"
                      )}>
                        {payout.status === "completed" ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : payout.status === "pending" ? (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">${payout.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payout.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn(
                      payout.status === "completed" && "text-green-600 border-green-300",
                      payout.status === "pending" && "text-yellow-600 border-yellow-300"
                    )}>
                      {payout.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={payoutModalOpen} onOpenChange={setPayoutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>
              Available balance: <strong>${vendor.commissionBalance.toFixed(2)}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                min="1"
                max={vendor.commissionBalance}
                step="0.01"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutModalOpen(false)}>Cancel</Button>
            <Button onClick={handlePayoutRequest} disabled={requesting}>
              {requesting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Request Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
