"use client";

import { BundleDetails } from "@/components/products/BundleDetails";

export default function BundlePage({ params }: { params: { id: string } }) {
  return <BundleDetails bundleId={params.id} />;
}
