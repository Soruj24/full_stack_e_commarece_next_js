import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Step bar skeleton */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                <Skeleton className="w-9 h-9 rounded-full" />
                <Skeleton className="w-16 h-3 rounded hidden sm:block" />
                {i < 4 && <Skeleton className="flex-1 mx-2 h-0.5 rounded-full" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main content skeleton */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Card skeleton */}
            <div className="rounded-3xl bg-card border border-border/30 shadow-lg shadow-black/5 p-8 space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="w-48 h-6 rounded-lg" />
                  <Skeleton className="w-32 h-4 rounded-lg" />
                </div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex justify-between">
              <Skeleton className="w-24 h-12 rounded-xl" />
              <Skeleton className="w-36 h-12 rounded-xl" />
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="w-full lg:w-[380px] space-y-6">
            <div className="rounded-3xl bg-card border border-border/30 shadow-lg shadow-black/5 p-6 space-y-4">
              <Skeleton className="w-40 h-5 rounded-lg" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-full h-4 rounded-lg" />
                      <Skeleton className="w-20 h-3 rounded-lg" />
                    </div>
                    <Skeleton className="w-14 h-4 rounded-lg" />
                  </div>
                ))}
              </div>
              <div className="border-t border-border/30 pt-4 space-y-3">
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-3/4 h-4 rounded-lg" />
                <Skeleton className="w-1/2 h-6 rounded-lg mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
