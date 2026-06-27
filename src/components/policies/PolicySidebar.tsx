"use client";

import { ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PolicySection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
  id: string;
}

interface PolicySidebarProps {
  sections: PolicySection[];
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export function PolicySidebar({ sections, activeSection, onSectionClick }: PolicySidebarProps) {
  return (
    <aside className="hidden lg:block lg:col-span-3">
      <div className="sticky top-24 space-y-8">
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">
            Contents
          </h3>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <section.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{section.title}</span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 ml-auto transition-transform",
                    activeSection === section.id
                      ? "translate-x-0"
                      : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  )}
                />
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <MessageCircle className="h-5 w-5" />
            <h4 className="font-black text-sm uppercase tracking-wider">
              Need Help?
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Have questions about our policy? Our support team is here to clarify any concerns.
          </p>
          <Button variant="outline" size="sm" className="w-full rounded-xl font-bold bg-background border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
            Contact Support
          </Button>
        </div>
      </div>
    </aside>
  );
}
