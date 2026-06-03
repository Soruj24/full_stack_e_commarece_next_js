import { Truck, RefreshCw, Shield, HeadphonesIcon, Twitter, Github, Instagram, Youtube, ArrowRight, MapPin, Mail, Phone } from "lucide-react";

export const TRUST_FEATURES = [
  { icon: Truck, label: "Free Shipping", desc: "On orders over $50", color: "#818cf8" },
  { icon: RefreshCw, label: "Easy Returns", desc: "30-day return policy", color: "#34d399" },
  { icon: Shield, label: "Secure Payment", desc: "SSL encrypted checkout", color: "#fbbf24" },
  { icon: HeadphonesIcon, label: "24/7 Support", desc: "Always here to help", color: "#f472b6" },
] as const;

export const SOCIAL_LINKS = [
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Github, label: "GitHub" },
  { icon: Youtube, label: "YouTube" },
] as const;

export const SHOP_LINKS = [
  { label: "All Products", href: "/products" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Best Sellers", href: "/products?sort=bestselling" },
  { label: "Sale Items", href: "/products?sale=true" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Bundles", href: "/bundles" },
] as const;

export const SUPPORT_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Track Order", href: "/track-order" },
  { label: "Support Tickets", href: "/support/tickets" },
  { label: "About Us", href: "/about" },
] as const;

export const CONTACT_INFO = {
  address: "123 Commerce Street,\nNew York, NY 10001",
  email: "support@shop.com",
  phone: "+1 (555) 123-4567",
} as const;

export const PAYMENT_ICONS = ["VISA", "MC", "AMEX", "PayPal", "Apple", "GPay"] as const;

export const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Sitemap", href: "/sitemap.xml" },
] as const;
