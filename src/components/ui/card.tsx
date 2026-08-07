import * as React from "react"

import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "elevated" | "outlined" | "flat"
}

function Card({ className, variant = "default", ...props }: CardProps) {
  const variantClasses = {
    default:
      "bg-card text-card-foreground rounded-xl border border-border/60 shadow-xs",
    elevated:
      "bg-card text-card-foreground rounded-xl shadow-lg shadow-black/[0.04] dark:shadow-black/[0.15]",
    outlined:
      "bg-card text-card-foreground rounded-xl border border-border",
    flat:
      "bg-surface text-card-foreground rounded-xl",
  }

  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-5 py-5 transition-all",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2.5 px-5 pb-4 border-b border-border/40 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-tight font-semibold text-base", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm leading-relaxed", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 space-y-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-5 pt-4 mt-auto border-t border-border/40", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
