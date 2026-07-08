import { useState, useEffect } from "react";
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

export function useReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/returns");
      const data = await res.json();
      if (data.success) setReturns(data.returns);
    } catch { toast.error("Failed to load returns"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReturns(); }, []);

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return { returns, loading, formatDate };
}
