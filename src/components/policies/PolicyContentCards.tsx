"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface PolicySection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
  id: string;
}

interface PolicyContentCardsProps {
  sections: PolicySection[];
  activeSection: string;
}

export function PolicyContentCards({ sections, activeSection }: PolicyContentCardsProps) {
  if (sections.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-[40px] border-2 border-dashed border-border">
        <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-black text-foreground">No matches found</h3>
        <p className="text-muted-foreground font-medium">Try adjusting your search query</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={cn(
            "group scroll-mt-24 p-8 md:p-10 rounded-[32px] border border-border bg-card transition-all duration-300",
            activeSection === section.id
              ? "shadow-2xl shadow-primary/5 border-primary/20 ring-1 ring-primary/10"
              : "hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
          )}
        >
          <div className="flex items-start gap-6">
            <div
              className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-primary/5 text-primary group-hover:bg-primary/10"
              )}
            >
              <section.icon className="h-7 w-7" />
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-primary/40 uppercase tracking-widest">
                  Section {index + 1}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-foreground">
                  {section.title}
                </h2>
              </div>
              <div className="text-muted-foreground leading-relaxed font-medium text-lg prose prose-primary max-w-none">
                {section.content}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
