import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const routes = [
    { url: "", priority: 1, changefreq: "daily" },
    { url: "/products", priority: 0.9, changefreq: "daily" },
    { url: "/categories", priority: 0.8, changefreq: "weekly" },
    { url: "/about", priority: 0.7, changefreq: "monthly" },
    { url: "/contact", priority: 0.7, changefreq: "monthly" },
    { url: "/faq", priority: 0.6, changefreq: "monthly" },
    { url: "/track-order", priority: 0.6, changefreq: "monthly" },
    { url: "/gift-cards", priority: 0.7, changefreq: "weekly" },
    { url: "/returns", priority: 0.6, changefreq: "monthly" },
    { url: "/privacy", priority: 0.4, changefreq: "yearly" },
    { url: "/terms", priority: 0.4, changefreq: "yearly" },
    { url: "/cookie-policy", priority: 0.4, changefreq: "yearly" },
    { url: "/login", priority: 0.5, changefreq: "yearly" },
    { url: "/register", priority: 0.5, changefreq: "yearly" },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changefreq as "daily" | "weekly" | "monthly" | "yearly",
    priority: route.priority,
  }));
}
