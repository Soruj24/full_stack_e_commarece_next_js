import { Vendor, Payout } from "@/types/vendor";

interface VendorResponse {
  success: boolean;
  vendors?: Vendor[];
  error?: string;
}

interface PayoutsResponse {
  success: boolean;
  payouts?: Payout[];
  error?: string;
}

interface PayoutRequestResponse {
  success: boolean;
  error?: string;
}

export async function fetchVendor(): Promise<Vendor | null> {
  try {
    const res = await fetch("/api/vendors");
    const data: VendorResponse = await res.json();
    if (data.success && data.vendors && data.vendors.length > 0) {
      return data.vendors[0];
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchPayouts(): Promise<Payout[]> {
  try {
    const res = await fetch("/api/payouts");
    const data: PayoutsResponse = await res.json();
    if (data.success) {
      return data.payouts || [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function requestPayout(
  amount: number,
  paymentMethod: string
): Promise<PayoutRequestResponse> {
  const res = await fetch("/api/payouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, paymentMethod }),
  });
  return res.json();
}
