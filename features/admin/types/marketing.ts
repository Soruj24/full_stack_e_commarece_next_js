export interface MarketingCoupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountAmount: number;
  minPurchase: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
}

export interface MarketingBanner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  isActive: boolean;
  type: string;
}

export interface SaleProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  onSale?: boolean;
  images?: string[];
  category?: string;
}

export interface NewCouponForm {
  code: string;
  discountType: string;
  discountAmount: number;
  minPurchase: number;
  expiryDate: string;
  usageLimit: number;
}

export interface NewBannerForm {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type: string;
}
