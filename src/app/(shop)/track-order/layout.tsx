import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order | ShopHub",
  description: "Track your order status and delivery progress in real-time.",
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
