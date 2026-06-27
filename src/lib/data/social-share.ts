import { Facebook, Twitter, Linkedin, MessageCircle, Mail } from "lucide-react";

export const SHARE_CONFIG = {
  facebook: {
    icon: Facebook,
    label: "Facebook",
    color: "#1877F2",
    getUrl: (url: string, title: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
  },
  twitter: {
    icon: Twitter,
    label: "Twitter",
    color: "#000000",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  linkedin: {
    icon: Linkedin,
    label: "LinkedIn",
    color: "#0A66C2",
    getUrl: (url: string, _title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  whatsapp: {
    icon: MessageCircle,
    label: "WhatsApp",
    color: "#25D366",
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  },
  email: {
    icon: Mail,
    label: "Email",
    color: "#EA4335",
    getUrl: (url: string, title: string, description?: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent((description || "") + "\n\n" + url)}`,
  },
} as const;
