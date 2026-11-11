"use client"

import * as React from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WishlistButtonProps extends Omit<React.ComponentProps<typeof Button>, "onClick" | "children" | "onToggle"> {
  active?: boolean
  onToggle?: (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
  label?: string
  activeLabel?: string
}

export function WishlistButton({
  active = false,
  onToggle,
  label = "Add to wishlist",
  activeLabel = "Remove from wishlist",
  className,
  variant = "outline",
  size = "icon",
  ...props
}: WishlistButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onToggle}
      aria-label={active ? activeLabel : label}
      aria-pressed={active}
      className={cn(
        "rounded-xl transition-all duration-200",
        active && "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive",
        className
      )}
      {...props}
    >
      <Heart className={cn("h-4 w-4", active && "fill-current")} />
    </Button>
  )
}
