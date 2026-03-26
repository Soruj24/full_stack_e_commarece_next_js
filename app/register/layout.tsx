import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | ShopHub",
  description: "Join ShopHub and enjoy exclusive deals, faster checkout, and personalized shopping.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
