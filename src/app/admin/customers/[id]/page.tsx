"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  ShieldCheck,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  Trash2,
  ExternalLink,
  Package,
  Star,
  Activity,
  MapPinned,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { User } from "@/shared/types";

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  items: { product: { name: string; images: string[] }; quantity: number; price: number }[];
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses" | "reviews" | "activity">("overview");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/admin/users`);
        const data = await res.json();
        if (data.success) {
          const found = data.users?.find((u: User) => (u._id || u.id) === id);
          if (found) setUser(found);
        }

        const orderRes = await fetch(`/api/admin/orders?keyword=${id}&limit=50`);
        const orderData = await orderRes.json();
        if (orderData.success) {
          setOrders(orderData.orders || []);
        }
      } catch {
        console.error("Failed to load customer");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, status: newStatus }),
      });
      if (res.ok && user) {
        setUser({ ...user, status: newStatus as User["status"] });
      }
    } catch {}
  };

  const handleRoleChange = async (newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, role: newRole }),
      });
      if (res.ok && user) {
        setUser({ ...user, role: newRole as User["role"] });
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      });
      if (res.ok) {
        router.push("/admin/customers");
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted/50 rounded" />
          <div className="h-64 bg-muted/30 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <EmptyState
          icon={UserX}
          title="Customer not found"
          description="This customer may have been deleted or does not exist."
          action={
            <Button variant="outline" size="sm" onClick={() => router.push("/admin/customers")}>
              Back to Customers
            </Button>
          }
        />
      </div>
    );
  }

  const totalSpending = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const completedOrders = orders.filter((o) => o.orderStatus === "delivered").length;

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Activity },
    { id: "orders" as const, label: "Orders", icon: Package, count: orders.length },
    { id: "addresses" as const, label: "Addresses", icon: MapPinned },
    { id: "reviews" as const, label: "Reviews", icon: Star },
    { id: "activity" as const, label: "Activity", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title="Customer Details" description={`Profile for ${user.name}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="border border-border/60 rounded-xl p-6 bg-card">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
              </div>
              <div>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  {user.twoFactorEnabled && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded font-medium">
                      2FA
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge variant={user.role === "admin" ? "info" : user.role === "vendor" ? "warning" : "default"}>
                  <Shield className="h-3 w-3" />
                  {user.role}
                </StatusBadge>
                <StatusBadge variant={user.status === "active" ? "success" : "danger"} dot>
                  {user.status}
                </StatusBadge>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {user.isVerified ? (
                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <UserX className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span>{user.isVerified ? "Email verified" : "Email not verified"}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/60 space-y-3">
              <InfoRow icon={Mail} label="Email" value={user.email} />
              {user.phoneNumber && <InfoRow icon={Phone} label="Phone" value={user.phoneNumber} />}
              {user.location && <InfoRow icon={MapPin} label="Location" value={user.location} />}
              {user.website && <InfoRow icon={Globe} label="Website" value={user.website} isLink />}
              {user.bio && (
                <div className="pt-2">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Bio</p>
                  <p className="text-xs text-foreground">{user.bio}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-border/60 space-y-3">
              <InfoRow
                icon={Calendar}
                label="Joined"
                value={new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              />
              <InfoRow
                icon={Clock}
                label="Last Login"
                value={
                  user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                    : "Never"
                }
              />
            </div>
          </div>

          <div className="border border-border/60 rounded-xl p-4 bg-card">
            <SectionHeader title="Account Actions" />
            <div className="mt-3 space-y-2">
              {user.status === "active" ? (
                <Button
                  variant="outline"
                  className="w-full justify-start text-amber-600"
                  onClick={() => handleStatusChange("banned")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Ban User
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start text-emerald-600"
                  onClick={() => handleStatusChange("active")}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Unban User
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-1 p-1 bg-muted/30 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatCard label="Total Orders" value={String(orders.length)} />
                <StatCard label="Total Spent" value={`$${totalSpending.toFixed(2)}`} />
                <StatCard label="Completed" value={`${completedOrders}`} />
              </div>

              <div className="border border-border/60 rounded-xl p-6 bg-card">
                <SectionHeader title="Recent Orders" />
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-4">No orders yet.</p>
                ) : (
                  <div className="mt-4 space-y-2">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">#{order._id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${order.totalAmount.toFixed(2)}</p>
                          <StatusBadge
                            variant={
                              order.orderStatus === "delivered"
                                ? "success"
                                : order.orderStatus === "cancelled"
                                  ? "danger"
                                  : "info"
                            }
                          >
                            {order.orderStatus}
                          </StatusBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                <div className="border border-border/60 rounded-xl p-6 bg-card">
                  <SectionHeader title="Social Links" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(user.socialLinks).map(([platform, url]) =>
                      url ? (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 text-sm hover:bg-muted/50 transition-colors"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          {platform}
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </a>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="border border-border/60 rounded-xl bg-card">
              {orders.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={Package}
                    title="No orders"
                    description="This customer hasn't placed any orders yet."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border/60">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Order</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Items</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium">#{order._id.slice(-6).toUpperCase()}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              variant={
                                order.orderStatus === "delivered"
                                  ? "success"
                                  : order.orderStatus === "cancelled"
                                    ? "danger"
                                    : "info"
                              }
                            >
                              {order.orderStatus}
                            </StatusBadge>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="border border-border/60 rounded-xl p-6 bg-card">
              <SectionHeader title="Saved Addresses" />
              <div className="mt-4">
                {user.location ? (
                  <div className="p-4 rounded-lg border border-border/60">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPinned className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Primary Address</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.location}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No addresses saved.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="border border-border/60 rounded-xl p-6 bg-card">
              <SectionHeader title="Customer Reviews" />
              <div className="mt-4">
                <EmptyState
                  icon={Star}
                  title="Reviews coming soon"
                  description="Customer reviews will appear here once available."
                />
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="border border-border/60 rounded-xl p-6 bg-card">
              <SectionHeader title="Account Activity" />
              <div className="mt-4 space-y-4">
                <ActivityItem
                  icon={UserCheck}
                  iconBg="bg-emerald-500/10"
                  iconColor="text-emerald-500"
                  title="Account created"
                  date={user.createdAt}
                />
                {user.lastLogin && (
                  <ActivityItem
                    icon={Clock}
                    iconBg="bg-blue-500/10"
                    iconColor="text-blue-500"
                    title="Last login"
                    date={user.lastLogin}
                  />
                )}
                {orders.map((order) => (
                  <ActivityItem
                    key={order._id}
                    icon={Package}
                    iconBg="bg-primary/10"
                    iconColor="text-primary"
                    title={`Order #${order._id.slice(-6).toUpperCase()} — $${order.totalAmount.toFixed(2)}`}
                    date={order.createdAt}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  isLink,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
        {isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
            {value}
          </a>
        ) : (
          <p className="text-xs text-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/60 rounded-xl p-4 bg-card">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function ActivityItem({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  date,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  date: string | Date;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", iconBg)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
