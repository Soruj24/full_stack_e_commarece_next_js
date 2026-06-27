import { useState, useEffect } from "react";
import { toast } from "sonner";

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

export function useAdminLowStock() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [alerts, setAlerts] = useState<AlertCount[]>([]);
  const [stats, setStats] = useState({ outOfStock: 0, lowStock: 0, pendingAlerts: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products/low-stock");
      const data = await res.json();
      if (data.success) { setProducts(data.lowStock); setAlerts(data.alerts); setStats(data.stats); }
    } catch { toast.error("Failed to fetch data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const getAlertCount = (productId: string) => alerts.find((a) => a._id === productId)?.count || 0;
  const getAlertEmails = (productId: string) => alerts.find((a) => a._id === productId)?.emails || [];

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    if (stock <= 3) return { label: "Critical", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" };
    return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
  };

  return { products, alerts, stats, loading, fetchData, getAlertCount, getAlertEmails, getStockStatus };
}
