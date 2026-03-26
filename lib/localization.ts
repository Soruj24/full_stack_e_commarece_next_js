export const translations: Record<
  string,
  Record<string, Record<string, string>>
> = {
  en: {
    common: {
      search: "Search",
      cart: "Cart",
      login: "Login",
      register: "Register",
      logout: "Logout",
      profile: "Profile",
      settings: "Settings",
    },
    products: {
      addToCart: "Add to Cart",
      outOfStock: "Out of Stock",
      new: "New",
      sale: "Sale",
    },
    cart: {
      title: "Your Cart",
      empty: "Your cart is empty",
      checkout: "Checkout",
      total: "Total",
    },
  },
  es: {
    common: {
      search: "Buscar",
      cart: "Carrito",
      login: "Iniciar Sesión",
      register: "Registrarse",
      logout: "Cerrar Sesión",
      profile: "Perfil",
      settings: "Configuración",
    },
    products: {
      addToCart: "Añadir al Carrito",
      outOfStock: "Agotado",
      new: "Nuevo",
      sale: "Oferta",
    },
    cart: {
      title: "Tu Carrito",
      empty: "Tu carrito está vacío",
      checkout: "Pagar",
      total: "Total",
    },
  },
  bn: {
    common: {
      search: "খুঁজুন",
      cart: "কার্ট",
      login: "লগইন",
      register: "রেজিস্টার",
      logout: "লগআউট",
      profile: "প্রোফাইল",
      settings: "সেটিংস",
    },
    products: {
      addToCart: "কার্টে যোগ করুন",
      outOfStock: "স্টকে নেই",
      new: "নতুন",
      sale: "ছাড়",
    },
    cart: {
      title: "আপনার কার্ট",
      empty: "আপনার কার্ট খালি",
      checkout: "চেকআউট",
      total: "মোট",
    },
  },
};

export const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
];

export const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "BDT", symbol: "৳" },
  { code: "INR", symbol: "₹" },
  { code: "CAD", symbol: "$" },
  { code: "AUD", symbol: "$" },
  { code: "JPY", symbol: "¥" },
];

export const countries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
];

export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);
}

const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  BDT: 110,
  INR: 83,
  CAD: 1.35,
  AUD: 1.5,
  JPY: 150,
};

export function convertPrice(amountUSD: number, targetCurrency: string): number {
  const rate = exchangeRates[targetCurrency.toUpperCase()] ?? 1;
  return Number((amountUSD * rate).toFixed(2));
}
