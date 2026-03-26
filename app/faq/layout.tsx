import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | ShopHub",
  description: "Find answers to common questions about shipping, returns, payments, and more.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
