"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface CompareAddCardProps {
  show: boolean;
}

export function CompareAddCard({ show }: CompareAddCardProps) {
  if (!show) return null;

  return (
    <Link
      href="/products"
      className="bg-card rounded-3xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-4 min-h-[400px] hover:border-primary hover:bg-primary/5 transition-all"
    >
      <Plus className="w-12 h-12 text-muted-foreground" />
      <p className="text-muted-foreground font-medium">Add Product</p>
    </Link>
  );
}