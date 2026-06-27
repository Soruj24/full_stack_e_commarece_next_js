
import { AuditLogsTable } from "@/components/admin/dashboard/AuditLogsTable";

interface AuditTabContentProps {
  auditLogs: any[];
}

export function AuditTabContent({ auditLogs }: AuditTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black tracking-tight">Audit Logs</h2>
        <p className="text-muted-foreground">
          Track system activities and security events.
        </p>
      </div>
      <AuditLogsTable logs={auditLogs} />
    </div>
  );
}
