"use client";

import { Save, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyActionBarProps {
  isEditing: boolean;
  loading: boolean;
  hasChanges: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

export function StickyActionBar({
  isEditing,
  loading,
  hasChanges,
  onSaveDraft,
  onPublish,
  onCancel,
}: StickyActionBarProps) {
  return (
    <div className="sticky bottom-0 z-30 bg-card border-t border-border/60 px-5 py-3">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-muted-foreground mr-2">
              Unsaved changes
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            disabled={loading}
            className="gap-1.5"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={onPublish}
            disabled={loading}
            className="gap-1.5"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isEditing ? "Update" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
