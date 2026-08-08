"use client";

import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description: string;
  saving: boolean;
  saved: boolean;
  error: string | null;
  hasChanges: boolean;
  onSave: () => void;
  children: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  saving,
  saved,
  error,
  hasChanges,
  onSave,
  children,
}: SettingsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="space-y-6">{children}</div>

      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <div className="text-xs">
          {error && <span className="text-destructive">{error}</span>}
          {saved && (
            <span className="text-emerald-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Saved
            </span>
          )}
        </div>
        <Button
          onClick={onSave}
          disabled={saving || !hasChanges}
          size="sm"
          className={cn(
            "min-w-[80px] transition-all",
            saved && "bg-emerald-600 hover:bg-emerald-600"
          )}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            "Saved"
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
}

export function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="rounded-xl border border-border/60 divide-y divide-border/60">
        {children}
      </div>
    </div>
  );
}
