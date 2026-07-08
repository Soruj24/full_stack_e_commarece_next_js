import * as React from "react"
import { cn } from "@/shared/utils"

type ContainerSize = "xs" | "sm" | "md" | "lg" | "xl" | "full"

interface ContainerProps extends React.ComponentProps<"div"> {
  size?: ContainerSize
}

const sizeMap: Record<ContainerSize, string> = {
  xs: "max-w-3xl",
  sm: "max-w-4xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
}

function Container({ className, size = "xl", ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeMap[size],
        className
      )}
      {...props}
    />
  )
}

export { Container }
