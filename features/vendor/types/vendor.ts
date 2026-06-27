export interface Vendor {
  _id: string;
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  commissionRate: number;
  commissionBalance: number;
  pendingPayout?: number;
  totalEarnings: number;
  totalSales: number;
  totalOrders?: number;
  rating?: number;
  numReviews?: number;
  contactEmail: string;
  userId: { _id: string; name: string; email: string };
  createdAt: string;
  rejectedReason?: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
}

export interface Payout {
  _id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  requestedAt: string;
  completedAt?: string;
}
