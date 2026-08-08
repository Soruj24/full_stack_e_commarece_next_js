import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function AdminSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-muted/50", className)} />
  );
}
