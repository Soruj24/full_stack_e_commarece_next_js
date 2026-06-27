"use client";

import { Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { changeTypeConfig } from "@/lib/data/changelog";
import type { ChangeType } from "@/lib/data/changelog";

interface Props {
  selectedType: ChangeType | "all";
  onTypeChange: (type: ChangeType | "all") => void;
}

export function ChangelogFilterBar({ selectedType, onTypeChange }: Props) {
  return (
    <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onTypeChange("all")}
              className={cn("px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                selectedType === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}>
              All
            </button>
            {(Object.keys(changeTypeConfig) as ChangeType[]).map((type) => {
              const Icon = changeTypeConfig[type].icon;
              return (
                <button key={type} onClick={() => onTypeChange(type)}
                  className={cn("px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                    selectedType === type ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}>
                  <Icon className="w-3.5 h-3.5" />{changeTypeConfig[type].label}
                </button>
              );
            })}
          </div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Github className="w-4 h-4" />View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
