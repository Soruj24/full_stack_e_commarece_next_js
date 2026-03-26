"use client";

import { useState, useEffect } from "react";
import { Package, AlertTriangle, Bell, Loader2, RefreshCw, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  images: string[];
  category?: { name: string };
}

interface AlertCount {
  _id: string;
  count: number;
  emails: string[];
}

export default function AdminLowStockPage() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [alerts, setAlerts] = useState<AlertCount[]>([]);
  const [stats, setStats] = useState({ outOfStock: 0, lowStock: 0, pendingAlerts: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products/low-stock");
      const data = await res.json();
      if (data.success) {
        setProducts(data.lowStock);
        setAlerts(data.alerts);
        setStats(data.stats);
      }
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAlertCount = (productId: string) => {
    const alert = alerts.find((a) => a._id === productId);
    return alert?.count || 0;
  };

  const getAlertEmails = (productId: string) => {
    const alert = alerts.find((a) => a._id === productId);
    return alert?.emails || [];
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    if (stock <= 3) return { label: "Critical", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" };
    return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Low Stock Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage inventory alerts</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <TrendingDown className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Bell className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Alerts</p>
                <p className="text-3xl font-bold text-blue-600">{stats.pendingAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Products Requiring Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">All Stock Levels Good</h3>
              <p className="text-muted-foreground">No products are currently low on stock.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Alert Subscribers</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const status = getStockStatus(product.stock);
                  const alertCount = getAlertCount(product._id);
                  const emails = getAlertEmails(product._id);

                  return (
                    <TableRow key={product._id} className={product.stock === 0 ? "bg-red-50/50 dark:bg-red-950/20" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                            <img
                              src={product.images?.[0] || "/placeholder.png"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.category?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-bold text-lg",
                          product.stock === 0 ? "text-red-600" : product.stock <= 3 ? "text-orange-600" : "text-yellow-600"
                        )}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(status.color)}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {alertCount > 0 ? (
                          <div>
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30 text-blue-600">
                              <Bell className="w-3 h-3 mr-1" />
                              {alertCount} waiting
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                              {emails.slice(0, 3).join(", ")}
                              {emails.length > 3 && ` +${emails.length - 3} more`}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No alerts</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/admin/inventory?product=${product._id}`}>
                            Restock
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
