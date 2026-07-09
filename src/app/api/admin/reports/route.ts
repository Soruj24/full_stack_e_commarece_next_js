import { NextResponse } from "next/server";

const REPORT_TYPES = [
  { value: "sales", label: "Sales Report" },
  { value: "revenue", label: "Revenue Report" },
  { value: "products", label: "Products Report" },
  { value: "customers", label: "Customers Report" },
  { value: "inventory", label: "Inventory Report" },
  { value: "tax", label: "Tax Report" },
] as const;

const GENERATED_REPORTS = [
  {
    id: "rpt_001",
    name: "Monthly Sales Summary",
    type: "sales",
    format: "pdf",
    dateRange: { from: "2026-06-01", to: "2026-06-30" },
    size: "2.4 MB",
    pages: 12,
    generatedAt: "2026-07-01T00:00:00Z",
    status: "completed",
  },
  {
    id: "rpt_002",
    name: "Q2 Revenue Analysis",
    type: "revenue",
    format: "xlsx",
    dateRange: { from: "2026-04-01", to: "2026-06-30" },
    size: "1.8 MB",
    pages: 8,
    generatedAt: "2026-07-01T00:00:00Z",
    status: "completed",
  },
  {
    id: "rpt_003",
    name: "Top Selling Products Q2",
    type: "products",
    format: "pdf",
    dateRange: { from: "2026-04-01", to: "2026-06-30" },
    size: "3.1 MB",
    pages: 15,
    generatedAt: "2026-06-30T12:00:00Z",
    status: "completed",
  },
  {
    id: "rpt_004",
    name: "Customer Acquisition Report",
    type: "customers",
    format: "csv",
    dateRange: { from: "2026-01-01", to: "2026-06-30" },
    size: "0.9 MB",
    pages: 4,
    generatedAt: "2026-06-28T08:30:00Z",
    status: "completed",
  },
  {
    id: "rpt_005",
    name: "Inventory Status Report",
    type: "inventory",
    format: "pdf",
    dateRange: { from: "2026-06-01", to: "2026-06-30" },
    size: "4.2 MB",
    pages: 22,
    generatedAt: "2026-06-25T16:00:00Z",
    status: "completed",
  },
  {
    id: "rpt_006",
    name: "Weekly Sales Snapshot",
    type: "sales",
    format: "pdf",
    dateRange: { from: "2026-06-24", to: "2026-06-30" },
    size: "0.5 MB",
    pages: 3,
    generatedAt: "2026-07-01T06:00:00Z",
    status: "generating",
  },
  {
    id: "rpt_007",
    name: "Tax Report Q2 2026",
    type: "tax",
    format: "pdf",
    dateRange: { from: "2026-04-01", to: "2026-06-30" },
    size: "1.2 MB",
    pages: 6,
    generatedAt: "2026-07-05T00:00:00Z",
    status: "scheduled",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      reports: GENERATED_REPORTS,
      reportTypes: REPORT_TYPES,
      totalReports: GENERATED_REPORTS.length,
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, type, dateRange, format = "pdf" } = body;

  if (!name || !type || !dateRange) {
    return NextResponse.json(
      { success: false, error: "Missing required fields: name, type, dateRange" },
      { status: 400 },
    );
  }

  const newReport = {
    id: `rpt_${String(Date.now()).slice(-6)}`,
    name,
    type,
    format,
    dateRange,
    size: null,
    pages: 0,
    generatedAt: new Date().toISOString(),
    status: "queued",
  };

  return NextResponse.json(
    { success: true, data: newReport, message: "Report generation queued" },
    { status: 201 },
  );
}
