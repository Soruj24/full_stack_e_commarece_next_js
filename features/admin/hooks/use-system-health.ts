"use client";

import { useState, useEffect } from "react";

interface HealthData {
  database: string;
  redis: string;
  system: { platform: string; cpuUsage: string; totalMemory: string; freeMemory: string; uptime: string; };
}

export function useSystemHealth() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch("/api/admin/system-health");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) setHealth(data.health);
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return { health, loading };
}
