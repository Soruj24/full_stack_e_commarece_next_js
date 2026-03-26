"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SettingsHeaderProps {
  saving: boolean;
  onSave: () => void;
}

export function SettingsHeader({ saving, onSave }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your website settings
        </p>
      </div>
      <Button onClick={onSave} disabled={saving}>
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
