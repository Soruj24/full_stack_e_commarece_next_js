"use client";

import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { partnershipTypes } from "@/lib/data/partners";

interface Props {
  selectedType: string | null;
  onSelectType: (id: string | null) => void;
  onApply: (title: string) => void;
}

export function PartnershipTypes({ selectedType, onSelectType, onApply }: Props) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Partnership Programs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the partnership model that best fits your business goals and start growing with us.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partnershipTypes.map((type) => (
            <div
              key={type.id}
              className={cn(
                "bg-card rounded-3xl border border-border/50 p-8 transition-all cursor-pointer",
                selectedType === type.id ? "border-primary shadow-lg shadow-primary/10" : "hover:border-primary/50",
              )}
              onClick={() => onSelectType(selectedType === type.id ? null : type.id)}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <type.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                  <p className="text-muted-foreground">{type.description}</p>
                </div>
              </div>
              {selectedType === type.id && (
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Benefits Include</h4>
                  <ul className="space-y-3">
                    {type.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4" onClick={(e) => { e.stopPropagation(); onApply(type.title); }}>
                    Apply Now <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
