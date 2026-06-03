import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="bg-card rounded-[32px] border border-border/50 overflow-hidden p-6 space-y-4">
      <Skeleton className="aspect-square rounded-2xl w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-32 rounded-2xl" />
      </div>
    </div>
  );
}
