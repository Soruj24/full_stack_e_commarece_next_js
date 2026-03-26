import { SystemHealth } from "./SystemHealth";
import { ActivityChart } from "./ActivityChart";
import { LiveUserMonitor } from "./LiveUserMonitor";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { SecurityActions } from "./SecurityActions";
import { AdminNotes } from "./AdminNotes";
import { ServerLogsViewer } from "./ServerLogsViewer";
import { EcommerceStats } from "./EcommerceStats";
import { IAuditLog } from "@/types";

interface OverviewTabContentProps {
  activityData: {
    date: string;
    count: number;
  }[];
  setup2FA: () => void;
  auditLogs: IAuditLog[];
  stats?: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    activeUsers: number;
    lowStockCount: number;
  };
}

export function OverviewTabContent({
  activityData,
  setup2FA,
  auditLogs,
  stats,
}: OverviewTabContentProps) {
  return (
    <div className="space-y-8">
      {stats && <EcommerceStats stats={stats} />}
      <SystemHealth />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActivityChart data={activityData} />
        <LiveUserMonitor />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityHeatmap />
        </div>
        <div className="space-y-8">
          <SecurityActions onSetup2FA={setup2FA} auditLogs={auditLogs} />
          <AdminNotes />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ServerLogsViewer />
      </div>
    </div>
  );
}
