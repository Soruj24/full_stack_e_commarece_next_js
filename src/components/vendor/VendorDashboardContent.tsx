"use client";

import Link from "next/link";
import { Check, DollarSign, ShoppingCart, Package, Star, Wallet, Send, History, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Vendor, Payout } from "@/features/vendor/types/vendor";
import { VendorPayoutHistory } from "./VendorPayoutHistory";

interface VendorDashboardContentProps {
  vendor: Vendor;
  payouts: Payout[];
  onRequestPayout: () => void;
}

const STATS = [
  { label: "Total Earnings", key: "totalEarnings" as const, icon: DollarSign, color: "text-green-600 bg-green-100" },
  { label: "Total Sales", key: "totalSales" as const, icon: ShoppingCart, color: "text-blue-600 bg-blue-100" },
  { label: "Total Orders", key: "totalOrders" as const, icon: Package, color: "text-purple-600 bg-purple-100" },
  { label: "Rating", key: "rating" as const, icon: Star, color: "text-yellow-600 bg-yellow-100", format: (v: number) => `${v.toFixed(1)} ⭐` },
];

export function VendorDashboardContent({
  vendor,
  payouts,
  onRequestPayout,
}: VendorDashboardContentProps) {
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
          {STATS.map((stat) => {
            const value = vendor[stat.key] ?? 0;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">
                        {stat.format ? stat.format(value as number) : String(value)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
                  <p className="text-2xl font-bold text-yellow-600">${(vendor.pendingPayout ?? 0).toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted">
                  <p className="text-sm text-muted-foreground">Commission Rate</p>
                  <p className="text-2xl font-bold">{vendor.commissionRate}%</p>
                </div>
              </div>
              <Button className="w-full" onClick={onRequestPayout} disabled={vendor.commissionBalance <= 0}>
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
                <Link href="/admin/products?vendor=true"><Package className="w-4 h-4 mr-2" />Manage Products</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/orders"><ShoppingCart className="w-4 h-4 mr-2" />View Orders</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/store/${vendor.storeSlug}`}><Store className="w-4 h-4 mr-2" />View Store</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <VendorPayoutHistory payouts={payouts} />
      </div>
    </div>
  );
}
