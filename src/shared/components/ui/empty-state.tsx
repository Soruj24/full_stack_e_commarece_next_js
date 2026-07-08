import * as React from "react"
import { cn } from "@/shared/utils"
import { Inbox, Package, Search, ShoppingCart, FileText, type LucideIcon } from "lucide-react"
import { Button } from "./button"

const iconMap: Record<string, LucideIcon> = {
  inbox: Inbox,
  package: Package,
  search: Search,
  cart: ShoppingCart,
  file: FileText,
}

interface EmptyStateProps {
  icon?: keyof typeof iconMap | LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = typeof icon === "string" ? iconMap[icon] : icon

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-center",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        {Icon && <Icon className="size-6 text-muted-foreground" />}
      </div>
      <div className="max-w-[240px] space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  className,
}: {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-center",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <FileText className="size-6 text-destructive" />
      </div>
      <div className="max-w-[240px] space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export { EmptyState, ErrorState }
