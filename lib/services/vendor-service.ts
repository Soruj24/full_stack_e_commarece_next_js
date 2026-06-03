import { Vendor } from "@/types/vendor";

interface VendorApiResponse {
  success: boolean;
  vendors?: Vendor[];
  error?: string;
}

export async function fetchVendors(
  statusFilter?: string
): Promise<Vendor[]> {
  try {
    const url =
      statusFilter && statusFilter !== "all"
        ? `/api/vendors?status=${statusFilter}`
        : "/api/vendors";
    const res = await fetch(url);
    const data: VendorApiResponse = await res.json();
    if (data.success && Array.isArray(data.vendors)) {
      return data.vendors;
    }
    return [];
  } catch {
    return [];
  }
}

export async function updateVendorStatus(
  vendorId: string,
  status: string,
  rejectedReason?: string
): Promise<{ success: boolean; error?: string }> {
  const body: Record<string, unknown> = { status };
  if (status === "rejected" && rejectedReason) {
    body.rejectedReason = rejectedReason;
  }

  const res = await fetch(`/api/vendors/${vendorId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}
