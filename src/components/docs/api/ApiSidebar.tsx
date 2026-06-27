"use client";

import { cn } from "@/lib/utils";
import { sidebarItems } from "@/lib/data/api-docs";

interface Props {
  activeSection: string;
  onSelect: (id: string) => void;
  open: boolean;
}

export function ApiSidebar({ activeSection, onSelect, open }: Props) {
  return (
    <aside className={cn(
      "fixed lg:sticky top-[73px] left-0 w-64 h-[calc(100vh-73px)] bg-background border-r overflow-y-auto z-40 transition-transform lg:translate-x-0",
      open ? "translate-x-0" : "-translate-x-full",
    )}>
      <nav className="p-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                activeSection === item.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted",
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
