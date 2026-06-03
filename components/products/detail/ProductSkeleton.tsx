export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-background/95 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <div className="aspect-square rounded-3xl bg-muted animate-pulse" />
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-muted animate-pulse" />
              ))}
            </div>
            <div className="h-12 w-32 bg-muted rounded animate-pulse" />
            <div className="p-8 rounded-3xl bg-muted/50 space-y-4">
              <div className="h-6 w-20 bg-muted rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-12 w-full bg-muted rounded-xl animate-pulse" />
                <div className="h-12 w-20 bg-muted rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
