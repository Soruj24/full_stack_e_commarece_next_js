import { ReactNode } from "react";
import {
  ShoppingBag, Smartphone, Watch, Headphones, Camera,
  Gamepad2, Laptop, Shirt,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, ReactNode> = {
  laptop: <Laptop className="w-5 h-5" />,
  phones: <Smartphone className="w-5 h-5" />,
  watches: <Watch className="w-5 h-5" />,
  headphones: <Headphones className="w-5 h-5" />,
  camera: <Camera className="w-5 h-5" />,
  gamepad: <Gamepad2 className="w-5 h-5" />,
  shirt: <Shirt className="w-5 h-5" />,
  default: <ShoppingBag className="w-5 h-5" />,
};

export const CATEGORY_GRADIENTS: Record<string, string> = {
  laptop: "from-blue-500 to-cyan-500",
  phones: "from-purple-500 to-pink-500",
  watches: "from-orange-500 to-red-500",
  headphones: "from-green-500 to-emerald-500",
  camera: "from-yellow-500 to-orange-500",
  gamepad: "from-indigo-500 to-violet-500",
  shirt: "from-pink-500 to-rose-500",
  default: "from-primary to-purple-500",
};

export interface FeaturedProductData {
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  badge: string;
}

export const FEATURED_PRODUCTS: FeaturedProductData[] = [
  {
    name: "Wireless Headphones Pro Max",
    price: 199,
    originalPrice: 299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    badge: "Best Seller",
  },
  {
    name: "Smart Watch Ultra Series",
    price: 449,
    originalPrice: 599,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    badge: "New",
  },
  {
    name: "Premium Laptop Pro 16",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1496181133206-85ce1e5e9b8f?w=300&h=300&fit=crop",
    badge: "-20%",
  },
];

export function getIcon(iconName?: string) {
  return iconName
    ? CATEGORY_ICONS[iconName] || CATEGORY_ICONS.default
    : CATEGORY_ICONS.default;
}

export function getGradient(iconName?: string) {
  return iconName
    ? CATEGORY_GRADIENTS[iconName] || CATEGORY_GRADIENTS.default
    : CATEGORY_GRADIENTS.default;
}
