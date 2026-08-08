"use client";

import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: string;
}

export function FormSection({
  title,
  description,
  icon: Icon,
  defaultOpen = true,
  children,
  badge,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-1.5 bg-muted/50 rounded-lg">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              {badge && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-5 py-5 border-t border-border/60 bg-card">
          {children}
        </div>
      )}
    </div>
  );
}
