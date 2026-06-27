"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ViewAllLinkProps {
  query: string;
  onClick: () => void;
}

export function ViewAllLink({ query, onClick }: ViewAllLinkProps) {
  return (
    <div className="pt-4 border-t border-border/50">
      <Link
        href={`/products?keyword=${query}`}
        onClick={onClick}
        className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 w-full rounded-xl sm:rounded-2xl bg-primary text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
      >
        Analyze all results for &ldquo;{query || "..."}&rdquo;
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Link>
    </div>
  );
}
