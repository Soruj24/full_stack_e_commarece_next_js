"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, ArrowUpRight, Monitor, Smartphone, Tablet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActiveUser {
  id: string;
  name: string;
  page: string;
  device: "desktop" | "mobile" | "tablet";
  duration: string;
}

export function LiveUserMonitor() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([
    { id: "1", name: "Alex Rivers", page: "/", device: "desktop", duration: "2m" },
    { id: "2", name: "Sarah Chen", page: "/products", device: "mobile", duration: "5m" },
    { id: "3", name: "Mike Ross", page: "/cart", device: "tablet", duration: "1m" },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const pages = ["/", "/products", "/cart", "/checkout", "/faq", "/contact"];
      const names = ["John Doe", "Jane Smith", "Robert Brown", "Emily White", "David Lee"];
      const devices: ("desktop" | "mobile" | "tablet")[] = ["desktop", "mobile", "tablet"];
      
      if (Math.random() > 0.7) {
        // Add a new user
        const newUser: ActiveUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: names[Math.floor(Math.random() * names.length)],
          page: pages[Math.floor(Math.random() * pages.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
          duration: "1m",
        };
        setActiveUsers(prev => [newUser, ...prev.slice(0, 4)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "desktop": return <Monitor className="w-3 h-3" />;
      case "mobile": return <Smartphone className="w-3 h-3" />;
      case "tablet": return <Tablet className="w-3 h-3" />;
      default: return <Monitor className="w-3 h-3" />;
    }
  };

  return (
    <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card">
      <CardHeader className="bg-card border-b border-border py-6 px-8 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <Globe className="h-5 w-5 text-emerald-500 animate-pulse" />
          </div>
          <CardTitle className="text-xl font-black text-foreground">Live Sessions</CardTitle>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none px-3 py-1 rounded-lg font-bold flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {activeUsers.length + 12} Active
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {activeUsers.map((user) => (
            <div key={user.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground flex items-center gap-2">
                    {user.name}
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded uppercase font-black">
                      {getDeviceIcon(user.device)}
                      {user.device}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                    Viewing <span className="text-primary font-bold">{user.page}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-foreground">{user.duration}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Duration</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-muted/20 text-center">
          <button className="text-[11px] font-black text-primary hover:text-primary/80 uppercase tracking-widest flex items-center justify-center gap-1 w-full transition-all">
            View Real-time Map <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
