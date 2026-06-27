import { TrendingUp, Zap, Heart, Handshake, Users, Globe, Star } from "lucide-react";

export const partnershipTypes = [
  {
    id: "reseller", title: "Reseller Partners",
    description: "Become a reseller and earn competitive margins on every sale.",
    icon: TrendingUp,
    benefits: ["Up to 40% commission on sales", "Dedicated account manager", "Marketing materials & resources", "Priority support", "Early access to new features"],
  },
  {
    id: "integration", title: "Integration Partners",
    description: "Integrate your platform with ours to offer seamless solutions.",
    icon: Zap,
    benefits: ["API access & documentation", "Technical support & guidance", "Joint marketing opportunities", "Partner directory listing", "Co-branded solutions"],
  },
  {
    id: "referral", title: "Referral Partners",
    description: "Refer clients and earn rewards for every successful referral.",
    icon: Heart,
    benefits: ["15% recurring commission", "Performance bonuses", "Sales enablement tools", "Co-selling opportunities", "VIP partner events"],
  },
  {
    id: "strategic", title: "Strategic Partners",
    description: "Build long-term partnerships for mutual growth and success.",
    icon: Handshake,
    benefits: ["Custom partnership agreements", "Executive sponsorship", "Strategic planning sessions", "Exclusive insights & data", "Innovation collaboration"],
  },
];

export const featuredPartners = [
  { id: "1", name: "TechCorp Solutions", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=100&fit=crop", category: "Technology", description: "Leading provider of enterprise software solutions", website: "https://example.com" },
  { id: "2", name: "CloudFirst Inc", logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=100&fit=crop", category: "Cloud Services", description: "Enterprise cloud infrastructure provider", website: "https://example.com" },
  { id: "3", name: "DataSync Pro", logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=100&fit=crop", category: "Data Analytics", description: "Advanced analytics and business intelligence", website: "https://example.com" },
  { id: "4", name: "PayEasy", logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=100&fit=crop", category: "Payments", description: "Global payment processing solutions", website: "https://example.com" },
  { id: "5", name: "ShipFast Logistics", logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=100&fit=crop", category: "Logistics", description: "Fast and reliable shipping services", website: "https://example.com" },
  { id: "6", name: "SecureAuth", logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=100&fit=crop", category: "Security", description: "Enterprise-grade authentication solutions", website: "https://example.com" },
];

export const stats = [
  { label: "Active Partners", value: "500+", icon: Users },
  { label: "Countries", value: "45+", icon: Globe },
  { label: "Partner Revenue", value: "$50M+", icon: TrendingUp },
  { label: "Avg. Partner Rating", value: "4.9", icon: Star },
];

export const integrationCategories = [
  { name: "Payment Gateways", count: 12 }, { name: "Shipping Providers", count: 8 },
  { name: "CRM Systems", count: 6 }, { name: "Marketing Tools", count: 15 },
  { name: "Analytics", count: 9 }, { name: "Accounting", count: 5 },
];

export const testimonials = [
  {
    id: "1",
    quote: "Partnering with this platform has been transformative for our business. The support and resources they provide are exceptional.",
    author: "Sarah Mitchell", role: "CEO, TechCorp Solutions",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    quote: "We've seen incredible growth since becoming a reseller partner. The commission structure and support are unmatched.",
    author: "James Rodriguez", role: "VP Sales, CloudFirst Inc",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    quote: "The integration was seamless and their technical team was incredibly helpful throughout the process.",
    author: "Emily Chen", role: "CTO, DataSync Pro",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];
