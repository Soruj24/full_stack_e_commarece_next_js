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
  description: string;
  refundAmount: number;
  refundMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  notes: { by: string; message: string; createdAt: string }[];
}

export function useReturnDetail(id: string) {
  const [returnReq, setReturnReq] = useState<ReturnRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const fetchReturn = async () => {
    try {
      const res = await fetch(`/api/returns/${id}`);
      const data = await res.json();
      if (data.success) setReturnReq(data.return);
    } catch { toast.error("Failed to load return details"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReturn(); }, [id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this return request?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/returns/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "cancel" }) });
      const data = await res.json();
      if (data.success) { toast.success("Return request cancelled"); fetchReturn(); }
      else toast.error(data.error);
    } catch { toast.error("Failed to cancel return"); }
    finally { setCancelling(false); }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return { returnReq, loading, cancelling, trackingNumber, setTrackingNumber, handleCancel, formatDate };
}
