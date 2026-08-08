import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-muted-foreground",
  change,
  changeType = "neutral",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-5 hover:border-border transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className={cn("p-2 rounded-lg bg-muted/50", iconColor)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "text-xs font-medium mb-0.5",
              changeType === "positive" && "text-emerald-600",
              changeType === "negative" && "text-red-500",
              changeType === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
