"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Cpu, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSystemHealth } from "@/hooks/use-system-health";

export function SystemHealth() {
  const { health, loading } = useSystemHealth();

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card animate-pulse">
          <CardContent className="p-8 h-[180px]" />
        </Card>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <HealthCard icon={<Database className="h-6 w-6 text-primary" />} label="Database" desc="MongoDB Atlas Cluster" status={health?.database} />
      <HealthCard icon={<Zap className="h-6 w-6 text-primary" />} label="Redis Cache" desc="Rate Limiting & Sessions" status={health?.redis} />
      <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card transition-all hover:shadow-primary/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl"><Cpu className="h-6 w-6 text-primary" /></div>
            <span className="text-xs font-black text-primary uppercase tracking-widest">Server Info</span>
          </div>
          <div className="space-y-4">
            <SysRow label="CPU Load" value={health?.system.cpuUsage || "N/A"} />
            <SysRow label="Memory" value={`${health?.system.freeMemory} / ${health?.system.totalMemory}`} />
            <SysRow label="Uptime" value={health?.system.uptime || "N/A"} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HealthCard({ icon, label, desc, status }: { icon: React.ReactNode; label: string; desc: string; status?: string }) {
  return (
    <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card transition-all hover:shadow-primary/10">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl">{icon}</div>
          <Badge variant="secondary" className={cn("rounded-full px-4 py-1 font-bold text-[11px] border-none shadow-sm",
            status === "Healthy" ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive")}>
            {status === "Healthy" ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <AlertCircle className="w-3 h-3 mr-1.5" />}
            {status}
          </Badge>
        </div>
        <h3 className="text-lg font-black text-foreground mb-1">{label}</h3>
        <p className="text-sm text-muted-foreground font-medium">{desc}</p>
      </CardContent>
    </Card>
  );
}

function SysRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground font-bold">{label}</span>
      <span className="text-sm font-black text-foreground">{value}</span>
    </div>
  );
}
