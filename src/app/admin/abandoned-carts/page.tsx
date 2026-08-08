"use client";

import { ShoppingCart, Trash2, Mail, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useAdminAbandonedCarts } from "@/modules/admin/hooks/use-admin-abandoned-carts";
import { PageHeader } from "@/components/admin/ui/PageHeader";

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="border border-border/60 rounded-xl p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "recovered": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "expired": return "bg-muted text-muted-foreground border-border/60";
    case "notified": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    default: return "bg-muted text-muted-foreground border-border/60";
  }
}

export default function AdminAbandonedCartsPage() {
  const {
    filteredCarts,
    loading,
    statusFilter,
    setStatusFilter,
    searchEmail,
    setSearchEmail,
    fetchCarts,
    handleSendRecoveryEmail,
    handleDeleteCart,
    handleMarkRecovered,
    stats,
  } = useAdminAbandonedCarts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Abandoned Carts"
        description="Track and recover abandoned shopping carts"
        action={
          <Button variant="outline" size="sm" onClick={fetchCarts} className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Carts" value={stats.total} icon={ShoppingCart} iconBg="bg-blue-500/10" iconColor="text-blue-500" />
        <KpiCard label="Active" value={stats.active} icon={ShoppingCart} iconBg="bg-amber-500/10" iconColor="text-amber-500" />
        <KpiCard label="Recovered" value={stats.recovered} icon={ShoppingCart} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" />
        <KpiCard label="Potential Value" value={`$${stats.potential.toFixed(2)}`} icon={ShoppingCart} iconBg="bg-purple-500/10" iconColor="text-purple-500" />
      </div>

      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <div className="p-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="max-w-xs h-9 rounded-lg bg-muted/50 border-border/60 text-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border/60 bg-muted/50 text-sm focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="recovered">Recovered</option>
              <option value="expired">Expired</option>
              <option value="notified">Notified</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recovery</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarts.map((cart) => (
                <TableRow key={cart._id}>
                  <TableCell className="text-sm font-medium">{cart.email || "Guest"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cart.items.slice(0, 2).map((item, i) => (
                        <Badge key={i} variant="outline" className="text-[11px] font-medium">
                          {item.quantity}x {item.name.substring(0, 15)}...
                        </Badge>
                      ))}
                      {cart.items.length > 2 && (
                        <Badge variant="outline" className="text-[11px] font-medium">
                          +{cart.items.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    ${cart.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[11px] font-medium ${getStatusBadge(cart.status)}`}>
                      {cart.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {cart.recoveryAttempts}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(cart.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {cart.status === "active" && cart.email && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleSendRecoveryEmail(cart._id)}
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {cart.status === "notified" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-emerald-600 hover:text-emerald-600"
                          onClick={() => handleMarkRecovered(cart._id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCart(cart._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCarts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                    No abandoned carts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
