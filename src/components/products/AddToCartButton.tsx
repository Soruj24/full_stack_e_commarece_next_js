"use client"

import * as React from "react"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps extends Omit<React.ComponentProps<typeof Button>, "onClick" | "children"> {
  onAdd?: (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
  label?: string
  addedLabel?: string
  icon?: boolean
  added?: boolean
}

export function AddToCartButton({
  onAdd,
  label = "Add to cart",
  addedLabel = "Added",
  icon = true,
  added = false,
  className,
  disabled,
  loading,
  ...props
}: AddToCartButtonProps) {
  const [internalAdded, setInternalAdded] = React.useState(false)
  const isAdded = added || internalAdded

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading || isAdded) return
    await onAdd?.(e)
    if (!added) {
      setInternalAdded(true)
      window.setTimeout(() => setInternalAdded(false), 1400)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      loading={loading}
      className={cn("gap-2", isAdded && "bg-success text-success-foreground hover:bg-success/90", className)}
      aria-label={isAdded ? addedLabel : label}
      {...props}
    >
      {icon ? (isAdded ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />) : null}
      <span>{isAdded ? addedLabel : label}</span>
    </Button>
  )
}
