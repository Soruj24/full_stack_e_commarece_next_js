import { useState } from "react";

const mockOrder = {
  id: "ORD-2024-123456",
  status: "shipped",
  estimatedDelivery: "March 28, 2024",
  items: [
    { name: "Wireless Headphones Pro", quantity: 1, price: 149.99 },
    { name: "Phone Case Premium", quantity: 2, price: 29.99 },
  ],
  total: 209.97,
  shippingAddress: { street: "123 Commerce Street", city: "New York", state: "NY", zip: "10001" },
  timeline: [
    { status: "ordered", title: "Order Placed", date: "March 20, 2024", completed: true },
    { status: "processing", title: "Processing", date: "March 21, 2024", completed: true },
    { status: "shipped", title: "Shipped", date: "March 22, 2024", completed: true },
    { status: "out_for_delivery", title: "Out for Delivery", date: "March 25, 2024", completed: false },
    { status: "delivered", title: "Delivered", date: "Est. March 28, 2024", completed: false },
  ],
};

export function useTrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return { orderId, setOrderId, email, setEmail, searched, handleSearch, mockOrder };
}
