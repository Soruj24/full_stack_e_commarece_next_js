"use client";

import { Activity, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AuditLog {
  _id: string;
  createdAt: string;
  userEmail: string;
  action: string;
  entityType: string;
  ipAddress: string;
}

interface ActivityFeedProps {
  logs: AuditLog[];
  loading?: boolean;
}

function getActionColor(action: string): string {
  if (action.includes("create") || action.includes("add")) return "text-emerald-500 bg-emerald-500/10";
  if (action.includes("delete") || action.includes("remove")) return "text-red-500 bg-red-500/10";
  if (action.includes("update") || action.includes("edit")) return "text-blue-500 bg-blue-500/10";
  if (action.includes("login") || action.includes("auth")) return "text-violet-500 bg-violet-500/10";
  return "text-muted-foreground bg-muted/50";
}

export function ActivityFeed({ logs, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60">
          <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-border/60">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4">
              <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Activity Feed</h3>
        </div>
        <Link
          href="/admin/dashboard?tab=audit"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border/60 max-h-[400px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No recent activity
          </div>
        ) : (
          logs.slice(0, 10).map((log) => (
            <div key={log._id} className="px-6 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors">
              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${getActionColor(log.action)}`}>
                <Activity className="h-3 w-3" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{log.userEmail}</span>
                  {" "}
                  <span className="text-muted-foreground">{log.action}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{log.entityType}</span>
                  <span className="text-xs text-muted-foreground/40">·</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
