"use client";

import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface ReviewDeliveryCardProps {
  icon: ReactNode;
  label: string;
  onEdit?: () => void;
  children: ReactNode;
}

export function ReviewDeliveryCard({ icon, label, onEdit, children }: ReviewDeliveryCardProps) {
  return (
    <div className="bg-muted/30 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-background rounded-lg">{icon}</div>
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
            {children}
          </div>
        </div>
        {onEdit && (
          <Button variant="ghost" size="sm" className="gap-2 text-primary" onClick={onEdit}>
            <Edit2 className="w-4 h-4" /> Edit
          </Button>
        )}
      </div>
    </div>
  );
}
