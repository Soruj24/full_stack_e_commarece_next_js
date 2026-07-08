import * as React from "react"
import { cn } from "@/shared/utils"

interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "elevated" | "outlined" | "ghost"
}

function Card({ className, variant = "default", ...props }: CardProps) {
  const variantClasses = {
    default: "bg-card text-card-foreground rounded-lg border shadow-sm",
    elevated: "bg-card text-card-foreground rounded-lg shadow-lg shadow-black/5",
    outlined: "bg-card text-card-foreground rounded-lg border-2",
    ghost: "bg-card text-card-foreground rounded-lg",
  }

  return (
    <div
      data-slot="card"
      className={cn(
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
        "flex flex-col gap-1.5 px-5 pt-5 pb-3 border-b",
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
      className={cn("font-semibold text-base leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 py-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-5 py-3 border-t", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
