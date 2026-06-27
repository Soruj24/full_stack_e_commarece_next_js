"use client";

import { Activity } from "lucide-react";

export function RecentActivity() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black uppercase tracking-tight">Recent Activity</h3>
      </div>
      <div className="bg-card rounded-[32px] border border-border/50 p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
          <Activity className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h4 className="font-bold text-foreground">No recent activity</h4>
          <p className="text-sm text-muted-foreground mt-1">Your recent actions will appear here.</p>
        </div>
      </div>
    </div>
  );
}
