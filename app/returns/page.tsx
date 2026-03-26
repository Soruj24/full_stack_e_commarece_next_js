"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ArrowLeft, Clock, Check, X, RefreshCw, Truck, DollarSign, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ReturnItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  reason: string;
  condition: string;
}

interface ReturnRequest {
  _id: string;
  orderId: { _id: string; orderNumber: string };
  items: ReturnItem[];
  status: string;
  reason: string;
  refundAmount: number;
  refundMethod: string;
  trackingNumber?: string;
  createdAt: string;
  notes: { by: string; message: string; createdAt: string }[];
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "Pending Review", icon: Clock, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
  approved: { label: "Approved", icon: Check, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  rejected: { label: "Rejected", icon: X, color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
  received: { label: "Item Received", icon: Package, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
  refunded: { label: "Refunded", icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
  cancelled: { label: "Cancelled", icon: X, color: "text-gray-600 bg-gray-100 dark:bg-gray-900/30" },
};

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/returns");
      const data = await res.json();
      if (data.success) {
        setReturns(data.returns);
      }
    } catch {
      toast.error("Failed to load returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Returns & Refunds</h1>
            <p className="text-muted-foreground">Track your return requests</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : returns.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">No Returns Yet</h2>
              <p className="text-muted-foreground mb-6">
                When you request a return, it will appear here.
              </p>
              <Button asChild>
                <Link href="/orders">View Orders</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {returns.map((ret) => {
              const config = statusConfig[ret.status] || statusConfig.pending;
              const Icon = config.icon;

              return (
                <Card key={ret._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.color)}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">Order #{ret.orderId?.orderNumber || ret.orderId?._id?.slice(-6)}</p>
                          <p className="text-sm text-muted-foreground">
                            Requested {formatDate(ret.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("gap-1", config.color)}>
                        {config.label}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      {ret.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                            <img src={item.image || "/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium line-clamp-1">{item.name}</p>
                            <p className="text-muted-foreground">Qty: {item.quantity} | ${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      {ret.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">+{ret.items.length - 2} more items</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Reason: </span>
                        <span className="font-medium">{ret.reason}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-green-600">${ret.refundAmount.toFixed(2)}</span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/returns/${ret._id}`}>
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {ret.notes.length > 0 && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium mb-1">Latest Update:</p>
                        <p className="text-sm text-muted-foreground">
                          {ret.notes[ret.notes.length - 1].message}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
