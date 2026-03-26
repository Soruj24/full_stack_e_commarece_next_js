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
          toast: "group-[.toaster]:bg-background group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:p-4",
          title: "group-[.toaster]:text-foreground font-semibold text-sm",
          description: "group-[.toaster]:text-muted-foreground text-xs",
          actionButton: "group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground rounded-lg font-semibold text-sm",
          cancelButton: "group-[.toaster]:bg-muted group-[.toaster]:text-muted-foreground rounded-lg text-sm",
          success: "group-[.toaster]:border-green-500/20",
          error: "group-[.toaster]:border-red-500/20",
          warning: "group-[.toaster]:border-orange-500/20",
          info: "group-[.toaster]:border-blue-500/20",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-green-500" />,
        info: <InfoIcon className="size-5 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-5 text-orange-500" />,
        error: <OctagonXIcon className="size-5 text-red-500" />,
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
