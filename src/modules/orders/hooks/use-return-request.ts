"use client";

import { useState } from "react";
import { toast } from "sonner";

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export function useReturnRequest(orderId: string) {
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [itemConditions, setItemConditions] = useState<Record<string, string>>({});

  const toggleItem = (item: OrderItem) => {
    setSelectedItems((prev) =>
      prev.find((i) => i.productId === item.productId)
        ? prev.filter((i) => i.productId !== item.productId)
        : [...prev, item]
    );
  };

  const handleSubmit = async (onSuccess: () => void) => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to return");
      return;
    }
    if (!reason) {
      toast.error("Please select a return reason");
      return;
    }

    setLoading(true);
    try {
      const returnItems = selectedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        reason,
        condition: itemConditions[item.productId] || "opened",
      }));

      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          items: returnItems,
          reason,
          description,
          refundMethod: "original",
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Return request submitted successfully");
        onSuccess();
        setSelectedItems([]);
        setReason("");
        setDescription("");
        setItemConditions({});
      } else {
        toast.error(data.error || "Failed to submit return request");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    selectedItems,
    reason,
    description,
    itemConditions,
    setReason,
    setDescription,
    setItemConditions,
    toggleItem,
    handleSubmit,
  };
}
