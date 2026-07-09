import type { Report, ReportConfig } from "@/modules/admin/types/analytics";

export async function fetchReports(): Promise<Report[]> {
  try {
    const res = await fetch("/api/admin/reports");
    const data = await res.json();
    if (data.success && Array.isArray(data.reports)) return data.reports;
    return [];
  } catch {
    return [];
  }
}

export async function generateReport(config: ReportConfig): Promise<{ success: boolean; error?: string; report?: Report }> {
  try {
    const res = await fetch("/api/admin/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function deleteReport(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/reports?id=${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}
