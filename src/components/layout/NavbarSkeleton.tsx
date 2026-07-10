"use client";

export function NavbarSkeleton() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
            <div className="hidden sm:block space-y-1.5">
              <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
              <div className="h-2.5 w-12 bg-muted/50 rounded animate-pulse" />
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-14 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden lg:block h-10 w-80 bg-muted/50 rounded-xl animate-pulse" />
            <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
            <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
            <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </nav>
  );
}
