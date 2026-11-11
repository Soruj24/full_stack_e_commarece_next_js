"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:bg-card/95 group-[.toaster]:backdrop-blur-xl group-[.toaster]:border-border/70 group-[.toaster]:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] group-[.toaster]:rounded-2xl group-[.toaster]:border group-[.toaster]:p-4",
          title: "group-[.toaster]:text-foreground font-semibold text-sm tracking-tight",
          description: "group-[.toaster]:text-muted-foreground text-xs leading-relaxed",
          actionButton: "group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground rounded-lg font-medium text-sm",
          cancelButton: "group-[.toaster]:bg-muted group-[.toaster]:text-muted-foreground rounded-lg text-sm",
          success: "group-[.toaster]:border-success/25",
          error: "group-[.toaster]:border-destructive/25",
          warning: "group-[.toaster]:border-warning/30",
          info: "group-[.toaster]:border-primary/20",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-success" />,
        info: <InfoIcon className="size-5 text-primary" />,
        warning: <TriangleAlertIcon className="size-5 text-warning" />,
        error: <OctagonXIcon className="size-5 text-destructive" />,
        loading: <Loader2Icon className="size-5 animate-spin text-primary" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      expand={false}
      closeButton
      {...props}
    />
  )
}

export { Toaster }
