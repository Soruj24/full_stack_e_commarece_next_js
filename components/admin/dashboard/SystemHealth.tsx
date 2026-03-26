"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Database, 
  Cpu, 
  HardDrive, 
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthData {
  database: string;
  redis: string;
  system: {
    platform: string;
    cpuUsage: string;
    totalMemory: string;
    freeMemory: string;
    uptime: string;
  };
}

export function SystemHealth() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/admin/system-health");
      
      if (!res.ok) {
        const text = await res.text();
        console.error(`API Error (${res.status}):`, text);
        try {
          const errorData = JSON.parse(text);
          console.error("Parsed error data:", errorData);
        } catch (e) {
          // Not JSON
        }
        return;
      }

      const data = await res.json();
      if (data.success) {
        setHealth(data.health);
      } else {
        console.error("API Error:", data.error, data.details);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

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
      {/* Database Health */}
      <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card transition-all hover:shadow-primary/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <Badge 
              variant="secondary"
              className={cn(
                "rounded-full px-4 py-1 font-bold text-[11px] border-none shadow-sm",
                health?.database === "Healthy" 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {health?.database === "Healthy" ? (
                <CheckCircle2 className="w-3 h-3 mr-1.5" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1.5" />
              )}
              {health?.database}
            </Badge>
          </div>
          <h3 className="text-lg font-black text-foreground mb-1">Database</h3>
          <p className="text-sm text-muted-foreground font-medium">MongoDB Atlas Cluster</p>
        </CardContent>
      </Card>

      {/* Redis Health */}
      <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card transition-all hover:shadow-primary/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <Badge 
              variant="secondary"
              className={cn(
                "rounded-full px-4 py-1 font-bold text-[11px] border-none shadow-sm",
                health?.redis === "Healthy" 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {health?.redis === "Healthy" ? (
                <CheckCircle2 className="w-3 h-3 mr-1.5" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1.5" />
              )}
              {health?.redis}
            </Badge>
          </div>
          <h3 className="text-lg font-black text-foreground mb-1">Redis Cache</h3>
          <p className="text-sm text-muted-foreground font-medium">Rate Limiting & Sessions</p>
        </CardContent>
      </Card>

      {/* System Resources */}
      <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card transition-all hover:shadow-primary/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs font-black text-primary uppercase tracking-widest">Server Info</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-bold">CPU Load</span>
              <span className="text-sm font-black text-foreground">{health?.system.cpuUsage}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-bold">Memory</span>
              <span className="text-sm font-black text-foreground">{health?.system.freeMemory} / {health?.system.totalMemory}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-bold">Uptime</span>
              <span className="text-sm font-black text-foreground">{health?.system.uptime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
