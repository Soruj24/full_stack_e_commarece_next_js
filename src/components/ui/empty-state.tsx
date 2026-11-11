import * as React from "react"
import { Inbox } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  secondaryAction?: React.ReactNode
}

function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border/70 bg-surface/50 px-6 py-12 sm:py-16",
        className
      )}
      {...props}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-border/50">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden="true" />}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {(action || secondaryAction || children) && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {action}
          {secondaryAction}
          {children}
        </div>
      )}
    </div>
  )
}

interface EmptyStateActionProps extends React.ComponentProps<typeof Button> {}

function EmptyStateAction({ className, ...props }: EmptyStateActionProps) {
  return <Button className={cn("min-w-[140px]", className)} {...props} />
}

export { EmptyState, EmptyStateAction }
