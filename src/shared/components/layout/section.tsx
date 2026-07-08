import * as React from "react"
import { cn } from "@/shared/utils"
import { Container } from "./container"

type SectionSpacing = "sm" | "md" | "lg" | "xl"

interface SectionProps extends React.ComponentPropsWithoutRef<"section"> {
  spacing?: SectionSpacing
  containerSize?: "xs" | "sm" | "md" | "lg" | "xl" | "full"
  contained?: boolean
}

const spacingMap: Record<SectionSpacing, string> = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-24 md:py-32",
}

function Section({
  className,
  spacing = "md",
  containerSize = "xl",
  contained = true,
  children,
  ...props
}: SectionProps) {
  const content = (
    <div
      data-slot="section"
      className={cn(spacingMap[spacing], className)}
      {...props}
    >
      {children}
    </div>
  )

  if (contained) {
    return <Container size={containerSize}>{content}</Container>
  }

  return content
}

interface SectionHeaderProps extends React.ComponentProps<"div"> {
  title: string
  description?: string
  align?: "left" | "center"
}

function SectionHeader({
  className,
  title,
  description,
  align = "center",
  ...props
}: SectionHeaderProps) {
  return (
    <div
      data-slot="section-header"
      className={cn(
        "mb-8 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
      {...props}
    >
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

export { Section, SectionHeader }
