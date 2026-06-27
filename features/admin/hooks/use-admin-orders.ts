import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

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
  shippingAddress?: { street: string; city: string; state: string; zipCode: string; country: string };
}

export function useAdminOrders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&limit=${pagination.limit}&search=${searchQuery}&status=${statusFilter}&paymentStatus=${paymentFilter}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setPagination(prev => ({ ...prev, page: data.pagination?.page || 1, total: data.pagination?.total || 0, pages: data.pagination?.pages || 0 }));
      }
    } catch { toast.error("Failed to fetch orders"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") redirect("/login");
    fetchOrders();
  }, [session, status]);

  useEffect(() => {
    const timer = setTimeout(() => fetchOrders(1), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, paymentFilter]);

  const handlePageChange = (newPage: number) => fetchOrders(newPage);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, orderStatus: newStatus }) });
      if (res.ok) { toast.success("Order status updated"); fetchOrders(pagination.page); }
    } catch { toast.error("Failed to update order status"); }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) || order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (statusFilter === "all" || order.orderStatus === statusFilter) && (paymentFilter === "all" || order.paymentStatus === paymentFilter);
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "processing").length,
    shipped: orders.filter((o) => o.orderStatus === "shipped").length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return { orders, filteredOrders, loading, searchQuery, setSearchQuery, statusFilter, setStatusFilter, paymentFilter, setPaymentFilter, selectedOrder, setSelectedOrder, isDialogOpen, setIsDialogOpen, pagination, fetchOrders, handlePageChange, handleUpdateStatus, stats, status, session };
}
