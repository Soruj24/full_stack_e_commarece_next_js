"use client";

import { motion } from "framer-motion";
import { 
  Sparkles,
  Flame,
  Percent,
  Star,
  Zap,
  Gift,
  Truck,
  Shield,
  Clock,
  Award,
  Package,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types";

interface ProductBadge {
  type: BadgeType;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

type BadgeType =
  | "featured"
  | "sale"
  | "new"
  | "hot"
  | "bestseller"
  | "freeShipping"
  | "trending"
  | "limited"
  | "eco"
  | "handmade"
  | "organic"
  | "premium";

interface ProductBadgesProps {
  product: Partial<IProduct>;
  badges?: BadgeType[];
  className?: string;
  position?: "top-left" | "top-right" | "all";
}

const BADGE_CONFIGS: Record<BadgeType, { 
  label: string; 
  icon: React.ReactNode;
  bgClass: string;
  textClass: string;
}> = {
  featured: {
    label: "Featured",
    icon: <Sparkles className="w-3 h-3" />,
    bgClass: "bg-primary",
    textClass: "text-primary-foreground",
  },
  sale: {
    label: "Sale",
    icon: <Percent className="w-3 h-3" />,
    bgClass: "bg-red-500",
    textClass: "text-white",
  },
  new: {
    label: "New",
    icon: <Zap className="w-3 h-3" />,
    bgClass: "bg-blue-500",
    textClass: "text-white",
  },
  hot: {
    label: "Hot",
    icon: <Flame className="w-3 h-3" />,
    bgClass: "bg-orange-500",
    textClass: "text-white",
  },
  bestseller: {
    label: "Best Seller",
    icon: <Star className="w-3 h-3" />,
    bgClass: "bg-yellow-500",
    textClass: "text-white",
  },
  freeShipping: {
    label: "Free Shipping",
    icon: <Truck className="w-3 h-3" />,
    bgClass: "bg-green-500",
    textClass: "text-white",
  },
  trending: {
    label: "Trending",
    icon: <TrendingIcon className="w-3 h-3" />,
    bgClass: "bg-purple-500",
    textClass: "text-white",
  },
  limited: {
    label: "Limited",
    icon: <Clock className="w-3 h-3" />,
    bgClass: "bg-amber-500",
    textClass: "text-white",
  },
  eco: {
    label: "Eco-Friendly",
    icon: <LeafIcon className="w-3 h-3" />,
    bgClass: "bg-emerald-500",
    textClass: "text-white",
  },
  handmade: {
    label: "Handmade",
    icon: <Award className="w-3 h-3" />,
    bgClass: "bg-amber-700",
    textClass: "text-white",
  },
  organic: {
    label: "Organic",
    icon: <LeafIcon className="w-3 h-3" />,
    bgClass: "bg-green-600",
    textClass: "text-white",
  },
  premium: {
    label: "Premium",
    icon: <Shield className="w-3 h-3" />,
    bgClass: "bg-zinc-800",
    textClass: "text-white",
  },
};

function TrendingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function ProductBadges({ 
  product, 
  badges, 
  className,
  position = "top-left" 
}: ProductBadgesProps) {
  const getAutoBadges = (): BadgeType[] => {
    const autoBadges: BadgeType[] = [];
    
    if (product.isFeatured) autoBadges.push("featured");
    if (product.onSale || (product.discountPrice && product.price && product.discountPrice < product.price)) {
      autoBadges.push("sale");
    }
    
    return autoBadges;
  };

  const displayBadges = badges || getAutoBadges();

  if (displayBadges.length === 0) return null;

  const calculateDiscount = () => {
    if (!product.discountPrice || !product.price || product.price === 0) return 0;
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {displayBadges.map((badge, index) => {
        const config = BADGE_CONFIGS[badge];
        const isDiscountBadge = badge === "sale";
        const discount = isDiscountBadge ? calculateDiscount() : 0;

        return (
          <motion.div
            key={badge}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider",
              config.bgClass,
              config.textClass,
              isDiscountBadge && "bg-red-500"
            )}
          >
            {config.icon}
            <span>
              {isDiscountBadge ? `-${discount}%` : config.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

interface ProductBadgeCardProps {
  badge: BadgeType;
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function ProductBadgeCard({ badge, count, onClick, className }: ProductBadgeCardProps) {
  const config = BADGE_CONFIGS[badge];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-primary/50 transition-colors",
        className
      )}
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", config.bgClass)}>
        <span className={config.textClass}>{config.icon}</span>
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-sm">{config.label}</p>
        {count !== undefined && (
          <p className="text-xs text-muted-foreground">{count} products</p>
        )}
      </div>
    </button>
  );
}
