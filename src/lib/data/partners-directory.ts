export const categories = [
  { id: "all", name: "All Partners", count: 156 },
  { id: "technology", name: "Technology", count: 42 },
  { id: "payments", name: "Payments", count: 28 },
  { id: "logistics", name: "Logistics", count: 35 },
  { id: "marketing", name: "Marketing", count: 24 },
  { id: "analytics", name: "Analytics", count: 18 },
  { id: "security", name: "Security", count: 15 },
  { id: "support", name: "Customer Support", count: 12 },
];

export const partnerTiers = [
  { id: "platinum", name: "Platinum", stars: 5 },
  { id: "gold", name: "Gold", stars: 4 },
  { id: "silver", name: "Silver", stars: 3 },
];

export interface Partner {
  id: string; name: string;
  logo: string; category: string; tier: string;
  description: string; website: string;
  location: string; founded: string; employees: string;
  rating: number; reviews: number;
  integrations: string[]; verified: boolean;
}

export function getTierColor(tier: string) {
  switch (tier) {
    case "platinum": return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
    case "gold": return "bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900";
    case "silver": return "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800";
    default: return "bg-gray-100 text-gray-800";
  }
}
export const partners = [
  { id: "1", name: "Stripe", logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3", category: "payments", tier: "platinum", description: "Payment processing for internet businesses.", website: "https://stripe.com", location: "San Francisco, CA", founded: "2010", employees: "5,000+", rating: 4.9, reviews: 2847, integrations: ["Checkout", "Billing", "Connect"], verified: true },
  { id: "2", name: "Cloudflare", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623", category: "security", tier: "platinum", description: "Web performance and security company.", website: "https://cloudflare.com", location: "San Francisco, CA", founded: "2009", employees: "3,000+", rating: 4.8, reviews: 1923, integrations: ["CDN", "DDoS Protection", "SSL"], verified: true },
  { id: "3", name: "ShipStation", logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d", category: "logistics", tier: "gold", description: "Shipping software designed to save e-commerce businesses time and money.", website: "https://shipstation.com", location: "Austin, TX", founded: "2011", employees: "500+", rating: 4.7, reviews: 1456, integrations: ["Shipping", "Tracking", "Returns"], verified: true },
  { id: "4", name: "Mailchimp", logo: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2", category: "marketing", tier: "platinum", description: "Marketing automation platform.", website: "https://mailchimp.com", location: "Atlanta, GA", founded: "2001", employees: "1,200+", rating: 4.6, reviews: 3421, integrations: ["Email", "Automation", "Landing Pages"], verified: true },
  { id: "5", name: "Google Analytics", logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71", category: "analytics", tier: "platinum", description: "Web analytics service that tracks and reports website traffic.", website: "https://analytics.google.com", location: "Mountain View, CA", founded: "2005", employees: "100,000+", rating: 4.5, reviews: 8923, integrations: ["Tracking", "Reports", "Goals"], verified: true },
  { id: "6", name: "Zendesk", logo: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3", category: "support", tier: "gold", description: "Customer service software and support ticket system.", website: "https://zendesk.com", location: "San Francisco, CA", founded: "2007", employees: "6,000+", rating: 4.4, reviews: 2156, integrations: ["Chat", "Support", "Help Center"], verified: true },
  { id: "7", name: "PayPal", logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3", category: "payments", tier: "platinum", description: "Digital payment platform enabling online payments.", website: "https://paypal.com", location: "San Jose, CA", founded: "1998", employees: "30,000+", rating: 4.3, reviews: 6547, integrations: ["Checkout", "Payouts", "Braintree"], verified: true },
  { id: "8", name: "Segment", logo: "https://images.unsplash.com/photo-1551434678-e076c223a692", category: "analytics", tier: "gold", description: "Customer data platform.", website: "https://segment.com", location: "San Francisco, CA", founded: "2011", employees: "1,000+", rating: 4.6, reviews: 1234, integrations: ["Sources", "Destinations", "Audiences"], verified: true },
  { id: "9", name: "Hotjar", logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f", category: "analytics", tier: "silver", description: "Behavior analytics tool.", website: "https://hotjar.com", location: "Malta, EU", founded: "2014", employees: "200+", rating: 4.5, reviews: 892, integrations: ["Recordings", "Heatmaps", "Surveys"], verified: true },
  { id: "10", name: "Intercom", logo: "https://images.unsplash.com/photo-1553484771-371a605b060b", category: "support", tier: "gold", description: "Customer messaging platform.", website: "https://intercom.com", location: "San Francisco, CA", founded: "2011", employees: "1,500+", rating: 4.7, reviews: 1876, integrations: ["Chat", "Email", "Bots"], verified: true },
  { id: "11", name: "UPS", logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d", category: "logistics", tier: "gold", description: "Global logistics company.", website: "https://ups.com", location: "Atlanta, GA", founded: "1907", employees: "500,000+", rating: 4.2, reviews: 4521, integrations: ["Shipping", "Tracking", "Freight"], verified: true },
  { id: "12", name: "FedEx", logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64", category: "logistics", tier: "gold", description: "International courier delivery services company.", website: "https://fedex.com", location: "Memphis, TN", founded: "1971", employees: "400,000+", rating: 4.1, reviews: 3892, integrations: ["Express", "Ground", "Freight"], verified: true },
];
