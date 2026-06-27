import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved for Later | ShopHub",
  description: "Items you saved for later. Move them to cart when ready.",
};

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
