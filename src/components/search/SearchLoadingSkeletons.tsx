"use client";

export function SearchLoadingSkeletons({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-3xl overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-muted" />
          <div className="p-5 space-y-3">
            <div className="h-4 w-1/4 bg-muted rounded" />
            <div className="h-6 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
