"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { OrdersHeader } from "@/components/admin/orders/OrdersHeader";
import { OrdersStats } from "@/components/admin/orders/OrdersStats";
import { OrdersSearch } from "@/components/admin/orders/OrdersSearch";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { AdminOrderDialog } from "@/components/admin/orders/AdminOrderDialog";

interface Order {
  _id: string;
  orderNumber: string;
  user: { name: string; email: string } | null;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/orders?page=${page}&limit=${pagination.limit}&search=${searchQuery}&status=${statusFilter}&paymentStatus=${paymentFilter}`
      );
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setPagination((prev) => ({
          ...prev,
          page: data.pagination?.page || 1,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      }
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      redirect("/login");
    }
    fetchOrders();
  }, [session, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, paymentFilter]);

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });
      if (res.ok) {
        toast.success("Order status updated");
        fetchOrders(pagination.page);
      }
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "processing").length,
    shipped: orders.filter((o) => o.orderStatus === "shipped").length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <OrdersHeader
          loading={loading}
          onRefresh={() => fetchOrders(pagination.page)}
        />

        <OrdersStats stats={stats} />

        <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden">
          <OrdersSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentFilter={paymentFilter}
            setPaymentFilter={setPaymentFilter}
          />

          <OrdersTable
            orders={filteredOrders}
            loading={loading}
            onView={(order) => {
              setSelectedOrder(order);
              setIsDialogOpen(true);
            }}
            onUpdateStatus={handleUpdateStatus}
          />

          <div className="p-4 border-t border-border/50">
            <ProfessionalPagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <AdminOrderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={selectedOrder}
        onSuccess={() => fetchOrders(pagination.page)}
      />
    </div>
  );
}
