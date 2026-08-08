"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface ContactHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function ContactHeader({ loading, onRefresh }: ContactHeaderProps) {
  return (
    <PageHeader
      title="Contact Messages"
      description="View and manage customer inquiries"
      action={
        <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      }
    />
  );
}
