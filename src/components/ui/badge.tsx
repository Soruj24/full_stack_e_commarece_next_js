import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 text-primary [a&]:hover:bg-primary/15",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/10 text-destructive [a&]:hover:bg-destructive/15 dark:bg-destructive/20",
        outline:
          "border-border/60 text-foreground [a&]:hover:bg-accent",
        success:
          "border-transparent bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        warning:
          "border-transparent bg-amber-500/10 text-amber-700 dark:text-amber-400",
        info:
          "border-transparent bg-primary/10 text-primary",
        ghost:
          "border-transparent bg-muted text-muted-foreground [a&]:hover:bg-muted/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    size?: "default" | "sm" | "lg"
  }) {
  const Comp = asChild ? Slot : "span"

  const sizeClasses = {
    sm: "px-1.5 py-px text-[10px]",
    default: "px-2 py-0.5 text-xs",
    lg: "px-2.5 py-1 text-sm",
  }

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), sizeClasses[size], className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
