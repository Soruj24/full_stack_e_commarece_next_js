import * as React from "react"
import { cn } from "@/shared/utils"

interface StackProps extends React.ComponentProps<"div"> {
  direction?: "row" | "column"
  gap?: number | string
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around"
  wrap?: boolean
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
}

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
}

function Stack({
  className,
  direction = "column",
  gap = 4,
  align,
  justify,
  wrap,
  ...props
}: StackProps) {
  const gapClass = typeof gap === "number" ? `gap-${gap}` : gap

  return (
    <div
      data-slot="stack"
      className={cn(
        "flex",
        direction === "column" ? "flex-col" : "flex-row",
        gapClass,
        align && alignMap[align],
        justify && justifyMap[justify],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    />
  )
}

export { Stack }
