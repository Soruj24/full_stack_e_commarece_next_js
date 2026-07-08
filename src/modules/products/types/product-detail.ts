import type { IProduct } from "@/shared/types/product";

export interface ProductDetail extends Omit<IProduct, "reviews"> {
  reviews?: Array<{
    _id: string;
    user: { name: string };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}
