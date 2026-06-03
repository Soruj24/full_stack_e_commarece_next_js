import { HelpCircle } from "lucide-react";

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Getting Started": <span className="text-2xl">🚀</span>,
  "Orders & Shipping": <span className="text-2xl">📦</span>,
  "Payments": <span className="text-2xl">💳</span>,
  "Returns": <span className="text-2xl">↩️</span>,
  "Account": <span className="text-2xl">👤</span>,
  "Products": <span className="text-2xl">🛍️</span>,
  "General": <HelpCircle className="w-5 h-5" />,
};

export const CATEGORY_GRADIENTS: Record<string, string> = {
  "Getting Started": "from-blue-500 to-cyan-500",
  "Orders & Shipping": "from-purple-500 to-pink-500",
  "Payments": "from-green-500 to-emerald-500",
  "Returns": "from-orange-500 to-red-500",
  "Account": "from-indigo-500 to-violet-500",
  "Products": "from-pink-500 to-rose-500",
  "General": "from-primary to-purple-500",
};
