"use client";

export function NavbarSkeleton() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-xl bg-primary/10 animate-pulse" />
            <div className="ml-2 h-6 w-24 bg-muted rounded-lg animate-pulse" />
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
          </div>
          <div className="flex md:hidden items-center space-x-2">
            <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
            <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </nav>
  );
}
