import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  category: { name: string; slug: string };
  productName: string;
}

export function ProductBreadcrumbs({ category, productName }: Props) {
  return (
    <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-12 overflow-x-auto whitespace-nowrap pb-2">
      <Link href="/" className="hover:text-primary transition-colors">Home</Link>
      <ChevronRight className="w-3 h-3" />
      <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
      <ChevronRight className="w-3 h-3" />
      <Link href={`/products?category=${category.slug}`} className="hover:text-primary transition-colors">
        {category.name}
      </Link>
      <ChevronRight className="w-3 h-3 text-primary/50" />
      <span className="text-primary truncate max-w-[200px]">{productName}</span>
    </nav>
  );
}
