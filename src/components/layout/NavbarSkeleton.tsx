"use client";

export function NavbarSkeleton() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
            <div className="hidden sm:block space-y-1.5">
              <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
              <div className="h-2.5 w-12 bg-muted/50 rounded animate-pulse" />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-16 bg-muted/60 rounded-lg animate-pulse" />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block h-10 w-64 bg-muted/40 rounded-lg animate-pulse" />
            <div className="w-9 h-9 bg-muted/60 rounded-lg animate-pulse" />
            <div className="w-9 h-9 bg-muted/60 rounded-lg animate-pulse" />
            <div className="w-9 h-9 bg-muted/60 rounded-lg animate-pulse" />
            <div className="hidden md:block w-9 h-9 bg-muted/60 rounded-lg animate-pulse" />
            <div className="hidden md:block w-9 h-9 bg-muted/60 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </nav>
  );
}
