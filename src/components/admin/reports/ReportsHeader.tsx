"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface ReportsHeaderProps {
  onGenerate: () => void;
}

export function ReportsHeader({ onGenerate }: ReportsHeaderProps) {
  return (
    <PageHeader
      title="Reports"
      description="Generate and manage business reports."
      action={
        <Button onClick={onGenerate} className="gap-2">
          <Plus className="w-4 h-4" />
          Generate Report
        </Button>
      }
    />
  );
}
