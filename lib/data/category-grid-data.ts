import { LucideIcon, Laptop, Smartphone, Watch, Headphones, Camera, Gamepad, Shirt, Home } from "lucide-react";

export interface CategoryData {
  name: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  glow: string;
  count: string;
  bg: string;
}

export const categories: CategoryData[] = [
  { name: "Laptops", icon: Laptop, href: "/products?category=laptops", gradient: "from-blue-600 via-indigo-600 to-violet-600", glow: "rgba(99, 102, 241, 0.4)", count: "240+ products", bg: "rgba(99, 102, 241, 0.08)" },
  { name: "Phones", icon: Smartphone, href: "/products?category=phones", gradient: "from-violet-600 via-purple-600 to-pink-600", glow: "rgba(139, 92, 246, 0.4)", count: "180+ products", bg: "rgba(139, 92, 246, 0.08)" },
  { name: "Watches", icon: Watch, href: "/products?category=watches", gradient: "from-orange-500 via-amber-500 to-yellow-500", glow: "rgba(245, 158, 11, 0.4)", count: "95+ products", bg: "rgba(245, 158, 11, 0.08)" },
  { name: "Audio", icon: Headphones, href: "/products?category=audio", gradient: "from-emerald-500 via-teal-500 to-cyan-500", glow: "rgba(16, 185, 129, 0.4)", count: "120+ products", bg: "rgba(16, 185, 129, 0.08)" },
  { name: "Cameras", icon: Camera, href: "/products?category=cameras", gradient: "from-rose-500 via-pink-500 to-fuchsia-600", glow: "rgba(244, 63, 94, 0.4)", count: "65+ products", bg: "rgba(244, 63, 94, 0.08)" },
  { name: "Gaming", icon: Gamepad, href: "/products?category=gaming", gradient: "from-indigo-500 via-violet-600 to-purple-700", glow: "rgba(124, 58, 237, 0.4)", count: "200+ products", bg: "rgba(124, 58, 237, 0.08)" },
  { name: "Fashion", icon: Shirt, href: "/products?category=fashion", gradient: "from-pink-500 via-rose-500 to-red-500", glow: "rgba(236, 72, 153, 0.4)", count: "500+ products", bg: "rgba(236, 72, 153, 0.08)" },
  { name: "Home & Living", icon: Home, href: "/products?category=home", gradient: "from-cyan-500 via-sky-500 to-blue-600", glow: "rgba(14, 165, 233, 0.4)", count: "300+ products", bg: "rgba(14, 165, 233, 0.08)" },
];
