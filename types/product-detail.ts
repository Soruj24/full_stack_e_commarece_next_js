export interface ProductDetail {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  category: { name: string; slug: string };
  brand?: string;
  stock: number;
  rating?: number;
  numReviews?: number;
  averageRating?: number;
  tags?: string[];
  shippingOptions?: Array<{ method: string; price: number; estimatedDays: string }>;
  reviews?: Array<{
    _id: string;
    user: { name: string };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}
