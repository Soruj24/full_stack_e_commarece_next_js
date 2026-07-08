"use client";

import { useCompare, CompareProduct } from "@/modules/compare/context/CompareContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GitCompare, Check, Plus } from "lucide-react";

interface CompareButtonProps {
  product: Omit<CompareProduct, "addedAt">;
  variant?: "default" | "icon" | "compact";
  className?: string;
  showLabel?: boolean;
}

export function CompareButton({
  product,
  variant = "default",
  className,
  showLabel = true,
}: CompareButtonProps) {
  const { addProduct, removeProduct, isInCompare, canAddMore } = useCompare();
  const inCompare = isInCompare(product._id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeProduct(product._id);
    } else {
      addProduct(product);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={cn(
          "rounded-full transition-all",
          inCompare && "bg-primary text-primary-foreground hover:bg-primary/90",
          !inCompare && "hover:bg-muted",
          className
        )}
        aria-label={inCompare ? "Remove from compare" : "Add to compare"}
      >
        {inCompare ? <Check className="w-4 h-4" /> : <GitCompare className="w-4 h-4" />}
      </Button>
    );
  }

  if (variant === "compact") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={cn(
          "gap-2 rounded-lg transition-all",
          inCompare && "bg-primary/10 text-primary",
          !inCompare && "text-muted-foreground hover:text-foreground",
          className
        )}
      >
        {inCompare ? (
          <>
            <Check className="w-4 h-4" />
            {showLabel && "Added"}
          </>
        ) : (
          <>
            <GitCompare className="w-4 h-4" />
            {showLabel && "Compare"}
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={inCompare ? "secondary" : "outline"}
      onClick={handleToggle}
      className={cn(
        "gap-2 rounded-xl transition-all",
        inCompare && "border-primary bg-primary/10 text-primary hover:bg-primary/20",
        !inCompare && "border-border hover:border-primary",
        className
      )}
      disabled={!inCompare && !canAddMore}
    >
      {inCompare ? (
        <>
          <Check className="w-4 h-4" />
          {showLabel && "In Compare"}
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          {showLabel && "Compare"}
        </>
      )}
    </Button>
  );
}
