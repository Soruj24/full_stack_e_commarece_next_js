import { Star } from "lucide-react";

interface Props {
  category: { name: string; slug: string };
  brand?: string;
  name: string;
  rating?: number;
  numReviews?: number;
}

export function ProductInfoHeader({ category, brand, name, rating, numReviews }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
          {category.name}
        </span>
        {brand && (
          <span className="bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            {brand}
          </span>
        )}
      </div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1]">{name}</h1>
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-primary/5 px-3 py-1.5 rounded-xl">
          <Star className="w-4 h-4 fill-primary text-primary" />
          <span className="text-sm font-black ml-1.5 text-primary">{(rating || 0).toFixed(1)}</span>
        </div>
        <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
          {numReviews} Verified Reviews
        </span>
      </div>
    </div>
  );
}
