import { cn } from "@/lib/utils"

function Skeleton({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "rounded" | "circular" }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-muted animate-pulse rounded-lg",
        variant === "rounded" && "rounded-xl",
        variant === "circular" && "rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
