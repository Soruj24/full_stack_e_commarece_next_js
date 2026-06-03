"use client";

import { ChevronDown, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { changeTypeConfig } from "@/lib/data/changelog";
import type { Version } from "@/lib/data/changelog";

interface Props {
  versions: Version[];
  expandedVersion: string | null;
  onToggleExpand: (id: string | null) => void;
  filteredLength: number;
  showAll: boolean;
  onToggleShowAll: () => void;
}

export function ChangelogTimeline({ versions, expandedVersion, onToggleExpand, filteredLength, showAll, onToggleShowAll }: Props) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-8">
            {versions.map((version, index) => {
              const isExpanded = expandedVersion === version.id;
              const isLeft = index % 2 === 0;

              return (
                <div key={version.id} className="relative">
                  <div className={cn(
                    "absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background z-10",
                    version.isNew ? "bg-primary" : "bg-muted-foreground",
                  )} />
                  <div className={cn(
                    "ml-14 md:ml-0 md:w-[calc(50%-2rem)]",
                    isLeft ? "md:mr-auto" : "md:ml-auto",
                  )}>
                    <button onClick={() => onToggleExpand(isExpanded ? null : version.id)}
                      className={cn("w-full bg-card rounded-2xl border border-border/50 p-6 text-left transition-all hover:shadow-lg",
                        isExpanded && "ring-2 ring-primary/20")}>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono font-bold">v{version.version}</Badge>
                            {version.isNew && (
                              <Badge className="bg-primary text-primary-foreground"><Zap className="w-3 h-3 mr-1" />Latest</Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-bold">{version.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {new Date(version.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                        </div>
                      </div>
                      <p className="text-muted-foreground">{version.description}</p>
                    </button>

                    {isExpanded && (
                      <div className="mt-4 ml-4 space-y-3">
                        {version.changes.map((change) => {
                          const config = changeTypeConfig[change.type];
                          const Icon = config.icon;
                          return (
                            <div key={change.id} className="flex items-start gap-3 bg-card rounded-xl border border-border/50 p-4">
                              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", config.bgColor)}>
                                <Icon className={cn("w-4 h-4", config.color)} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm">{change.description}</p>
                                {change.link && (
                                  <a href={change.link} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                                    Learn more <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLength > 5 && (
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="rounded-xl" onClick={onToggleShowAll}>
                {showAll ? "Show Less" : `Show All ${filteredLength} Releases`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
