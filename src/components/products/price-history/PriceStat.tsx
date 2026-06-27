import { cn } from "@/lib/utils";

interface PriceStatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
  valueClassName?: string;
}

export function PriceStat({ label, value, icon, highlight, valueClassName }: PriceStatProps) {
  return (
    <div className={cn("p-3 rounded-xl", highlight ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-muted/50")}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">{icon}{label}</div>
      <p className={cn("text-lg font-bold", valueClassName)}>{value}</p>
    </div>
  );
}
