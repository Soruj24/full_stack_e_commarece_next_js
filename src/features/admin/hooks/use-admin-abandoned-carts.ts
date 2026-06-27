import { useState, useEffect, useCallback } from "react";

interface AbandonedCartItem {
  productId: { name: string; images?: string[] };
  name: string;
  price: number;
  quantity: number;
}

export interface AbandonedCart {
  _id: string;
  email?: string;
  items: AbandonedCartItem[];
  totalAmount: number;
  status: "active" | "recovered" | "expired" | "notified";
  recoveryAttempts: number;
  createdAt: string;
  expiresAt: string;
}

export function useAdminAbandonedCarts() {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchEmail, setSearchEmail] = useState("");

  const fetchCarts = useCallback(async () => {
    setLoading(true);
    try {
      const url = statusFilter !== "all" ? `/api/abandoned-carts?status=${statusFilter}` : "/api/abandoned-carts";
      const res = await fetch(url);
      setCarts(await res.json());
    } catch (error) { console.error("Failed to fetch carts:", error); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchCarts(); }, [fetchCarts]);

  const handleSendRecoveryEmail = async (cartId: string) => {
    try {
      await fetch(`/api/abandoned-carts/${cartId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "notified", lastNotifiedAt: new Date(), recoveryAttempts: 1 }) });
      fetchCarts();
    } catch (error) { console.error("Failed to send email:", error); }
  };

  const handleDeleteCart = async (cartId: string) => {
    if (!confirm("Are you sure you want to delete this abandoned cart?")) return;
    try { await fetch(`/api/abandoned-carts/${cartId}`, { method: "DELETE" }); fetchCarts(); }
    catch (error) { console.error("Failed to delete cart:", error); }
  };

  const handleMarkRecovered = async (cartId: string) => {
    try {
      await fetch(`/api/abandoned-carts/${cartId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "recovered", recoveredAt: new Date() }) });
      fetchCarts();
    } catch (error) { console.error("Failed to mark recovered:", error); }
  };

  const filteredCarts = carts.filter((cart) => cart.email?.toLowerCase().includes(searchEmail.toLowerCase()));
  const stats = {
    total: carts.length,
    active: carts.filter((c) => c.status === "active").length,
    recovered: carts.filter((c) => c.status === "recovered").length,
    potential: carts.reduce((sum, c) => sum + c.totalAmount, 0),
  };

  return { carts, filteredCarts, loading, statusFilter, setStatusFilter, searchEmail, setSearchEmail, fetchCarts, handleSendRecoveryEmail, handleDeleteCart, handleMarkRecovered, stats };
}
