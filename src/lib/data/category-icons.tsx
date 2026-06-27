import { Laptop, Smartphone, Watch, Headphones, Camera, Gamepad2, Shirt, Home, Gift, Book, Car, UtensilsCrossed, WatchIcon, Grid3X3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface IconOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

const ICON_OPTIONS: IconOption[] = [
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "phones", label: "Smartphone", icon: Smartphone },
  { value: "watches", label: "Watches", icon: Watch },
  { value: "headphones", label: "Headphones", icon: Headphones },
  { value: "camera", label: "Camera", icon: Camera },
  { value: "gamepad", label: "Gamepad", icon: Gamepad2 },
  { value: "shirt", label: "Shirt", icon: Shirt },
  { value: "home", label: "Home", icon: Home },
  { value: "gift", label: "Gift", icon: Gift },
  { value: "book", label: "Book", icon: Book },
  { value: "car", label: "Car", icon: Car },
  { value: "utensils", label: "Utensils", icon: UtensilsCrossed },
  { value: "watch", label: "Watch", icon: WatchIcon },
];

export const CATEGORY_ICONS = ICON_OPTIONS;

export const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {};
for (const opt of ICON_OPTIONS) {
  CATEGORY_ICON_MAP[opt.value] = <opt.icon className="w-4 h-4" />;
}
CATEGORY_ICON_MAP.default = <Grid3X3 className="w-4 h-4" />;
