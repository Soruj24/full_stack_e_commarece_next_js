"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShieldCheck, ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { sidebarGroups } from "@/lib/data/admin-sidebar";

export function AdminSidebar({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-card border-r border-border/60 h-screen transition-all duration-300",
        isCollapsed && !isMobile ? "w-[68px]" : "w-60",
        isMobile && "w-full border-r-0"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border/60 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="p-2 bg-primary rounded-lg shrink-0">
            <ShieldCheck className="w-4 h-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-sm font-semibold tracking-tight text-foreground whitespace-nowrap">
              Nexus<span className="text-muted-foreground font-normal"> Admin</span>
            </span>
          )}
        </Link>
      </div>

      {/* Search (collapsed only shows icon) */}
      {!isCollapsed && !isMobile && (
        <div className="px-3 pt-3 pb-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground bg-muted/50 rounded-lg border border-border/60 hover:border-border transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
            <kbd className="ml-auto text-[10px] text-muted-foreground/60 border border-border/60 rounded px-1 py-0.5 font-mono">
              ⌘K
            </kbd>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 no-scrollbar">
        {sidebarGroups.map((group, groupIndex) => {
          const isGroupActive = group.items.some(
            (item) =>
              pathname === item.href || pathname.startsWith(item.href + "/")
          );

          return (
            <div key={group.label} className={cn(groupIndex > 0 && "mt-4")}>
              {!isCollapsed && (
                <span className="px-2.5 mb-1 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                  {group.label}
                </span>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      title={isCollapsed ? item.title : undefined}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse Toggle (desktop only) */}
      {!isMobile && (
        <div className="px-2.5 py-2 border-t border-border/60">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center h-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      )}
    </aside>
  );
}
