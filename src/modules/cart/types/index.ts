export interface GiftWrappingOption {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
  pattern?: string;
  image?: string;
}

export interface GiftMessage {
  to: string;
  from: string;
  message: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  isBundle?: boolean;
  bundleProducts?: { id: string; name: string; price: number; image: string }[];
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}
