"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VendorStatCardsProps {
  statusCounts: Record<string, number>;
  total: number;
  currentFilter: string;
  onFilterChange: (status: string) => void;
}

const STAT_ITEMS = [
  { status: "all", label: "All", color: "" },
  { status: "pending", label: "Pending", color: "text-yellow-600" },
  { status: "approved", label: "Approved", color: "text-green-600" },
  { status: "rejected", label: "Rejected", color: "text-red-600" },
];

export function VendorStatCards({
  statusCounts,
  total,
  currentFilter,
  onFilterChange,
}: VendorStatCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {STAT_ITEMS.map((item) => (
        <Card
          key={item.status}
          className={cn(
            "cursor-pointer hover:shadow-md transition-shadow",
            currentFilter === item.status && "ring-2 ring-primary"
          )}
          onClick={() => onFilterChange(item.status)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "font-bold",
                  item.color,
                  currentFilter === item.status && "border-primary"
                )}
              >
                {item.status === "all" ? total : statusCounts[item.status] || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
