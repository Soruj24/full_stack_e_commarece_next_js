export interface FloatingCardData {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: string;
  badge: string;
  badgeColor: string;
  image: string;
  delay: number;
  position: string;
  animate: string;
}

export const floatingCards: FloatingCardData[] = [
  {
    id: 1,
    name: "AirPods Pro Max",
    price: "$549",
    originalPrice: "$699",
    rating: 4.9,
    reviews: "12.4k",
    badge: "🔥 Hot",
    badgeColor: "from-orange-500 to-red-500",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop",
    delay: 0,
    position: "top-0 right-0",
    animate: "animate-float",
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    price: "$1,299",
    originalPrice: "$1,599",
    rating: 4.8,
    reviews: "8.2k",
    badge: "⚡ New",
    badgeColor: "from-violet-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
    delay: 0.5,
    position: "bottom-16 -left-6",
    animate: "animate-float-delayed",
  },
  {
    id: 3,
    name: "Smart Watch Ultra",
    price: "$399",
    originalPrice: "$499",
    rating: 4.7,
    reviews: "5.6k",
    badge: "✨ Sale",
    badgeColor: "from-emerald-500 to-teal-500",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    delay: 1,
    position: "top-1/2 -right-4",
    animate: "animate-float",
  },
];
