import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Gift Cards | ShopHub",
  description: "Send the perfect gift. Purchase digital gift cards for your friends and family.",
};

export default function GiftCardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
