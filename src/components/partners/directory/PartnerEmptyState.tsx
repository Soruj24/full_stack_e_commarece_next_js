"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onClear: () => void;
}

export function PartnerEmptyState({ onClear }: Props) {
  return (
    <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
      <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
      <h3 className="font-bold mb-2">No partners found</h3>
      <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
      <Button variant="outline" onClick={onClear}>Clear filters</Button>
    </div>
  );
}
