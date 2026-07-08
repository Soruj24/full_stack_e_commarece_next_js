export interface ICategory {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  parent?: ICategory | string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  productCount?: number;
  children?: ICategory[];
  createdAt?: string;
  updatedAt?: string;
}
