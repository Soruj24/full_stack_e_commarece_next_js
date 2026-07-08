import * as React from "react"
import { cn } from "@/shared/utils"

interface DividerProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical"
  label?: string
}

function Divider({
  className,
  orientation = "horizontal",
  label,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        data-slot="divider"
        className={cn("mx-2 h-full w-px bg-border", className)}
        {...props}
      />
    )
  }

  if (label) {
    return (
      <div
        data-slot="divider"
        className={cn("flex items-center gap-3", className)}
        {...props}
      >
        <div className="flex-1 border-t" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-1 border-t" />
      </div>
    )
  }

  return (
    <div
      data-slot="divider"
      className={cn("my-4 h-px bg-border", className)}
      {...props}
    />
  )
}

export { Divider }
