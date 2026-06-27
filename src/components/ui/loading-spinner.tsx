import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "secondary" | "primary";
}

export function LoadingSpinner({
  className,
  size = "md",
  variant = "default",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "h-3 w-3 border",
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-2",
    xl: "h-12 w-12 border-3",
  };

  const variantClasses = {
    default: "border-primary/20 border-t-primary",
    secondary: "border-muted-foreground/20 border-t-muted-foreground",
    primary: "border-primary border-t-transparent",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)} role="status">
      <span className="sr-only">Loading...</span>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function LoadingPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-full bg-current", className)}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
}

export function InlineLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center gap-2" role="status">
      <LoadingSpinner size="sm" />
      {text && (
        <span className="text-xs text-muted-foreground">{text}</span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
