export interface IBanner {
  _id: string;
  title: string;
  subtitle?: string | undefined;
  image: string;
  link?: string | undefined;
  type: string;
  isActive: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };

  rating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
  stock: number;
  brand?: string | undefined;
  sku?: string | undefined;
  tags?: string[] | undefined;
  colors?: string[] | undefined;
  sizes?: string[] | undefined;
  isFeatured?: boolean | undefined;
  isArchived?: boolean | undefined;
  onSale?: boolean | undefined;
}
