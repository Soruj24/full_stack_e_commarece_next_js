import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parent?: mongoose.Types.ObjectId | ICategory;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    image: { type: String },
    icon: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  count: true,
  options: { match: { isActive: true, isArchived: false } },
});

categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
  options: { sort: { order: 1 } },
});

categorySchema.virtual("parentChain").get(function () {
  return [];
});

categorySchema.index({ order: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ name: "text", description: "text" });

export const Category =
  mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

interface CategoryNode {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  parent?: mongoose.Types.ObjectId | null;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  children: CategoryNode[];
}

export async function getCategoryTree(
  filter?: Record<string, unknown>
): Promise<CategoryNode[]> {
  const query = { isActive: true, ...filter };
  const categories = await Category.find(query)
    .sort({ order: 1 })
    .lean() as unknown as CategoryNode[];

  const map = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  categories.forEach((cat) => {
    map.set(cat._id.toString(), { ...cat, children: [] });
  });

  categories.forEach((cat) => {
    const node = map.get(cat._id.toString());
    if (node) {
      if (cat.parent && map.has(cat.parent.toString())) {
        map.get(cat.parent.toString())!.children.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  return roots;
}

export async function getSubcategories(
  parentId: string,
  options?: { includeParent?: boolean; activeOnly?: boolean }
): Promise<Record<string, unknown>[]> {
  const query: Record<string, unknown> = {};
  if (options?.activeOnly !== false) query.isActive = true;

  const childIds = await Category.find({ parent: parentId, ...query })
    .select("_id")
    .lean() as { _id: mongoose.Types.ObjectId }[];

  const subcategories = await Category.find({
    _id: { $in: childIds.map((c) => c._id) },
    ...query,
  })
    .sort({ order: 1 })
    .lean();

  return subcategories;
}

export async function getCategoryPath(
  categoryId: string
): Promise<Record<string, unknown>[]> {
  const path: Record<string, unknown>[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const cat: Record<string, unknown> | null = await Category.findById(currentId).lean();
    if (!cat) break;
    path.unshift(cat);
    currentId = cat.parent ? String(cat.parent) : null;
  }

  return path;
}
