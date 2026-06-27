"use client";

import dynamic from "next/dynamic";

const PageTransition = dynamic(
  () => import("./PageTransition").then((mod) => mod.PageTransition),
  { ssr: false }
);

export function PageTransitionClient({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
