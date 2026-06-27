"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (pathname === "/") return null;

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-8">
      <Link href="/" className="hover:text-primary transition-colors duration-200 flex items-center gap-1.5 font-medium">
        <Home className="w-4 h-4" />
        Home
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        return (
          <div key={href} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/40" />
            <Link
              href={href}
              className={cn(
                "capitalize hover:text-primary transition-colors duration-200",
                isLast ? "font-semibold text-foreground pointer-events-none" : "font-medium"
              )}
            >
              {segment.replace(/-/g, " ")}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
