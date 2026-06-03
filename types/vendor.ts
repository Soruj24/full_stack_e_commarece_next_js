export interface Vendor {
  _id: string;
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  commissionRate: number;
  commissionBalance: number;
  totalEarnings: number;
  totalSales: number;
  contactEmail: string;
  userId: { _id: string; name: string; email: string };
  createdAt: string;
  rejectedReason?: string;
}
