"use client";

import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { Database, Cpu, Zap, Server } from "lucide-react";
import { useSystemHealth } from "@/modules/admin/hooks/use-system-health";
import { AdminSkeleton } from "@/components/admin/ui/Skeleton";

export function SystemHealth() {
  const { health, loading } = useSystemHealth();

  if (loading) {
    return (
      <div>
        <SectionHeader title="System Health" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card p-5">
              <AdminSkeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="System Health" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <HealthCard
          icon={Database}
          label="Database"
          sublabel="MongoDB Atlas"
          status={health?.database}
        />
        <HealthCard
          icon={Zap}
          label="Redis Cache"
          sublabel="Rate Limiting"
          status={health?.redis}
        />
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-muted/50">
              <Server className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Server</span>
              <span className="block text-xs text-muted-foreground">
                {health?.system.uptime || "N/A"} uptime
              </span>
            </div>
          </div>
          <div className="space-y-2.5">
            <SysRow label="CPU" value={health?.system.cpuUsage || "N/A"} />
            <SysRow label="Memory" value={`${health?.system.freeMemory} / ${health?.system.totalMemory}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthCard({
  icon: Icon,
  label,
  sublabel,
  status,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sublabel: string;
  status?: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted/50">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">{label}</span>
            <span className="block text-xs text-muted-foreground">{sublabel}</span>
          </div>
        </div>
        <StatusBadge
          variant={status === "Healthy" ? "success" : "danger"}
          dot
        >
          {status || "Unknown"}
        </StatusBadge>
      </div>
    </div>
  );
}

function SysRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  );
}
