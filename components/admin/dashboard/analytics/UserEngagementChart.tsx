"use client";

import { Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AnalyticsData } from "@/types/analytics";

interface UserEngagementChartProps {
  data: AnalyticsData["userEngagement"];
}

export function UserEngagementChart({ data }: UserEngagementChartProps) {
  return (
    <div className="p-10 rounded-[48px] bg-card border border-border/50 shadow-2xl shadow-primary/5">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black tracking-tighter">
            User <span className="text-primary">Engagement</span>
          </h3>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            New user registrations (Last 30 days)
          </p>
        </div>
        <div className="p-3 bg-muted/50 rounded-2xl">
          <Users className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }} />
            <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "24px", border: "none", boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)", padding: "16px" }} />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
