"use client";

import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportsHeaderProps {
  onGenerate: () => void;
}

export function ReportsHeader({ onGenerate }: ReportsHeaderProps) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Reports
        </h1>
        <p className="text-muted-foreground">
          Generate and manage business reports.
        </p>
      </div>
      <Button onClick={onGenerate} className="rounded-2xl font-bold gap-2">
        <Plus className="w-4 h-4" />
        Generate Report
      </Button>
    </div>
  );
}
