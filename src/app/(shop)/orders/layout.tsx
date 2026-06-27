import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | ShopHub",
  description: "Track and manage your orders. View order history, status, and track deliveries.",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
