"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Search, Trash2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  module: string;
  message: string;
}

export function ServerLogsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>("");

  const logLevels = {
    info: "bg-blue-500/10 text-blue-500",
    warn: "bg-orange-500/10 text-orange-500",
    error: "bg-destructive/10 text-destructive",
    debug: "bg-muted text-muted-foreground",
  };

  useEffect(() => {
    // Generate initial logs
    const initialLogs: LogEntry[] = [
      { id: "1", timestamp: new Date().toISOString(), level: "info", module: "AUTH", message: "User session initialized for admin@example.com" },
      { id: "2", timestamp: new Date().toISOString(), level: "warn", module: "DB", message: "Database connection pool reaching 80% capacity" },
      { id: "3", timestamp: new Date().toISOString(), level: "error", module: "API", message: "Failed to fetch external weather data" },
    ];
    setLogs(initialLogs);

    // Simulate incoming logs
    const interval = setInterval(() => {
      const levels: ("info" | "warn" | "error" | "debug")[] = ["info", "warn", "error", "debug"];
      const modules = ["AUTH", "DB", "API", "EMAIL", "FS"];
      const messages = [
        "New user registration successful",
        "Cache cleared manually by admin",
        "SMTP server connection timeout",
        "Profile image uploaded to Cloudinary",
        "Backup task completed in 1.2s",
      ];

      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        level: levels[Math.floor(Math.random() * levels.length)],
        module: modules[Math.floor(Math.random() * modules.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };

      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) ||
    log.module.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card h-[500px] flex flex-col">
      <CardHeader className="bg-card border-b border-border py-6 px-8 flex flex-row items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-black text-foreground">Live Server Logs</CardTitle>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all w-40 md:w-60 font-bold"
            />
          </div>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground" title="Download Logs">
            <Download className="h-4 w-4" />
          </button>
          <button 
            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors text-muted-foreground"
            onClick={() => setLogs([])}
            title="Clear Logs"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto font-mono text-[11px] p-4 space-y-1 no-scrollbar bg-zinc-950">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex gap-4 group py-0.5 border-b border-white/5 last:border-0">
              <span className="text-zinc-500 shrink-0 font-medium">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <Badge className={`uppercase text-[9px] px-1.5 py-0 rounded font-black shrink-0 border-none ${logLevels[log.level]}`}>
                {log.level}
              </Badge>
              <span className="text-primary font-black shrink-0 w-12">{log.module}</span>
              <span className="text-zinc-300 break-all">{log.message}</span>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
              <Terminal className="w-12 h-12 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-[10px]">No logs matching filter</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
