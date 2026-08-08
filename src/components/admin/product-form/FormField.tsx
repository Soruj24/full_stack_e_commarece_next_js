"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  required,
  description,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label
        htmlFor={htmlFor}
        className="text-xs font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
