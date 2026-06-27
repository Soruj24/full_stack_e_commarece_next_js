export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  brand: string;
  sku: string;
  tags: string;
  colors: string;
  sizes: string;
  isFeatured: boolean;
  isArchived: boolean;
  onSale: boolean;
  discountPrice: string;
  images: string[];
  newImageUrl: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Brand {
  _id: string;
  name: string;
}
