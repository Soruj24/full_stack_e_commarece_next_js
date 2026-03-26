"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

const useSidebar = () => React.useContext(SidebarContext)

const sidebarVariants = cva(
  "fixed inset-y-0 left-0 z-50 w-72 border-r bg-background/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out",
  {
    variants: {
      state: {
        open: "translate-x-0",
        closed: "-translate-x-full",
      },
    },
    defaultVariants: {
      state: "open",
    },
  }
)

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, defaultOpen = true, open: controlledOpen, onOpenChange, children, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen

    const setIsOpen = React.useCallback(
      (newOpen: boolean) => {
        if (!isControlled) {
          setInternalOpen(newOpen)
        }
        onOpenChange?.(newOpen)
      },
      [isControlled, onOpenChange]
    )

    const contextValue = React.useMemo(
      () => ({ isOpen: open, setIsOpen }),
      [open, setIsOpen]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(sidebarVariants({ state: open ? "open" : "closed" }), className)}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  const { isOpen, setIsOpen } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("absolute top-4 -right-14 rounded-xl hover:bg-primary/10", className)}
      onClick={() => setIsOpen(!isOpen)}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      {...props}
    >
      <PanelLeft className="h-5 w-5" />
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-bold text-lg leading-none tracking-tight", className)}
    {...props}
  />
))
SidebarTitle.displayName = "SidebarTitle"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto p-4", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-t", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1", className)}
    {...props}
  />
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ComponentType<{ className?: string }>; active?: boolean }
>(({ className, icon: Icon, active, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
      active 
        ? "bg-primary text-primary-foreground shadow-lg" 
        : "hover:bg-muted text-muted-foreground hover:text-foreground",
      className
    )}
    {...props}
  >
    {Icon && <Icon className="h-5 w-5" />}
    {children}
  </button>
))
SidebarItem.displayName = "SidebarItem"

export {
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarTitle,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  useSidebar,
}