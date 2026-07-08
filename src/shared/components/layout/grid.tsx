import * as React from "react"
import { cn } from "@/shared/utils"

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12

interface GridProps extends React.ComponentProps<"div"> {
  cols?: GridCols
  colsSm?: GridCols
  colsMd?: GridCols
  colsLg?: GridCols
  colsXl?: GridCols
  gap?: number | string
}

const colMap: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
}

const colSmMap: Record<GridCols, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
  12: "sm:grid-cols-12",
}

const colMdMap: Record<GridCols, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
}

const colLgMap: Record<GridCols, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
}

const colXlMap: Record<GridCols, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
  12: "xl:grid-cols-12",
}

function Grid({
  className,
  cols = 1,
  colsSm,
  colsMd,
  colsLg,
  colsXl,
  gap = 4,
  ...props
}: GridProps) {
  const gapClass = typeof gap === "number" ? `gap-${gap}` : gap

  return (
    <div
      data-slot="grid"
      className={cn(
        "grid",
        colMap[cols],
        colsSm && colSmMap[colsSm],
        colsMd && colMdMap[colsMd],
        colsLg && colLgMap[colsLg],
        colsXl && colXlMap[colsXl],
        gapClass,
        className
      )}
      {...props}
    />
  )
}

export { Grid }
