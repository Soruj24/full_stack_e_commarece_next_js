"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasActiveFilters: boolean;
  onApply: () => void;
  onReset: () => void;
  children: React.ReactNode;
}

export function MobileFilterDrawer({
  open,
  onOpenChange,
  hasActiveFilters,
  onApply,
  onReset,
  children,
}: MobileFilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" size="lg">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 py-4">{children}</div>
        </ScrollArea>
        <SheetFooter className="px-4 pb-4">
          <div className="flex gap-2 w-full">
            {hasActiveFilters && (
              <Button variant="outline" onClick={onReset} className="flex-1">
                Reset
              </Button>
            )}
            <Button onClick={onApply} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
