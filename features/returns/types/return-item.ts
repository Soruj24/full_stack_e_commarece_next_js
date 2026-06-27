export interface ReturnRequest {
  _id: string;
  orderId: { _id: string; orderNumber: string; totalAmount: number };
  userId: { _id: string; name: string; email: string };
  items: { name: string; quantity: number; price: number }[];
  status: string;
  reason: string;
  refundAmount: number;
  refundMethod: string;
  createdAt: string;
  notes: { by: string; message: string; createdAt: string }[];
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  approved: { label: "Approved", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  rejected: { label: "Rejected", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
  received: { label: "Received", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  refunded: { label: "Refunded", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
  cancelled: { label: "Cancelled", color: "text-gray-600", bgColor: "bg-gray-100 dark:bg-gray-900/30" },
};

export function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
}

export function formatReturnDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
