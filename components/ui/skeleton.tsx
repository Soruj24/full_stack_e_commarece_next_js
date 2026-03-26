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
        "bg-accent animate-pulse rounded-xl",
        variant === "rounded" && "rounded-2xl",
        variant === "circular" && "rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
