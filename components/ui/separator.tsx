"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  gradient = false,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & { gradient?: boolean }) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        gradient ? "bg-gradient-to-r from-transparent via-border to-transparent" : "bg-border",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
