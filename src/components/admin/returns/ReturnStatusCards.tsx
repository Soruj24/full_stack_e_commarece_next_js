"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "@/modules/returns/types/return-item";

interface ReturnStatusCardsProps {
  statusCounts: Record<string, number>;
  activeStatus: string;
  onStatusClick: (status: string) => void;
}

export function ReturnStatusCards({ statusCounts, activeStatus, onStatusClick }: ReturnStatusCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Object.entries(STATUS_CONFIG).map(([status, config]) => (
        <Card key={status} className={cn("cursor-pointer hover:shadow-md transition-shadow", activeStatus === status && "ring-2 ring-primary")}
          onClick={() => onStatusClick(status)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{config.label}</span>
              <Badge variant="outline" className={cn("font-bold", config.bgColor, config.color)}>
                {statusCounts[status] || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
