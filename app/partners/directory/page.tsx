"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Globe, 
  ExternalLink, 
  Star,
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  ChevronDown,
  X,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All Partners", count: 156 },
  { id: "technology", name: "Technology", count: 42 },
  { id: "payments", name: "Payments", count: 28 },
  { id: "logistics", name: "Logistics", count: 35 },
  { id: "marketing", name: "Marketing", count: 24 },
  { id: "analytics", name: "Analytics", count: 18 },
  { id: "security", name: "Security", count: 15 },
  { id: "support", name: "Customer Support", count: 12 },
];

const partnerTiers = [
  { id: "platinum", name: "Platinum", color: "bg-gray-100 text-gray-800", stars: 5 },
  { id: "gold", name: "Gold", color: "bg-yellow-100 text-yellow-800", stars: 4 },
  { id: "silver", name: "Silver", color: "bg-slate-100 text-slate-800", stars: 3 },
];

const partners = [
  {
    id: "1",
    name: "Stripe",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=100&fit=crop",
    category: "payments",
    tier: "platinum",
    description: "Payment processing for internet businesses. Stripe is the best way to accept payments online.",
    website: "https://stripe.com",
    location: "San Francisco, CA",
    founded: "2010",
    employees: "5,000+",
    rating: 4.9,
    reviews: 2847,
    integrations: ["Checkout", "Billing", "Connect"],
    verified: true,
  },
  {
    id: "2",
    name: "Cloudflare",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=100&fit=crop",
    category: "security",
    tier: "platinum",
    description: "Web performance and security company that helps build a better Internet.",
    website: "https://cloudflare.com",
    location: "San Francisco, CA",
    founded: "2009",
    employees: "3,000+",
    rating: 4.8,
    reviews: 1923,
    integrations: ["CDN", "DDoS Protection", "SSL"],
    verified: true,
  },
  {
    id: "3",
    name: "ShipStation",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=100&fit=crop",
    category: "logistics",
    tier: "gold",
    description: "Shipping software designed to save e-commerce businesses time and money.",
    website: "https://shipstation.com",
    location: "Austin, TX",
    founded: "2011",
    employees: "500+",
    rating: 4.7,
    reviews: 1456,
    integrations: ["Shipping", "Tracking", "Returns"],
    verified: true,
  },
  {
    id: "4",
    name: "Mailchimp",
    logo: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=100&fit=crop",
    category: "marketing",
    tier: "platinum",
    description: "Marketing automation platform that helps you manage and talk to your clients.",
    website: "https://mailchimp.com",
    location: "Atlanta, GA",
    founded: "2001",
    employees: "1,200+",
    rating: 4.6,
    reviews: 3421,
    integrations: ["Email", "Automation", "Landing Pages"],
    verified: true,
  },
  {
    id: "5",
    name: "Google Analytics",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=100&fit=crop",
    category: "analytics",
    tier: "platinum",
    description: "Web analytics service that tracks and reports website traffic.",
    website: "https://analytics.google.com",
    location: "Mountain View, CA",
    founded: "2005",
    employees: "100,000+",
    rating: 4.5,
    reviews: 8923,
    integrations: ["Tracking", "Reports", "Goals"],
    verified: true,
  },
  {
    id: "6",
    name: "Zendesk",
    logo: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=200&h=100&fit=crop",
    category: "support",
    tier: "gold",
    description: "Customer service software and support ticket system.",
    website: "https://zendesk.com",
    location: "San Francisco, CA",
    founded: "2007",
    employees: "6,000+",
    rating: 4.4,
    reviews: 2156,
    integrations: ["Chat", "Support", "Help Center"],
    verified: true,
  },
  {
    id: "7",
    name: "PayPal",
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=100&fit=crop",
    category: "payments",
    tier: "platinum",
    description: "Digital payment platform enabling online payments.",
    website: "https://paypal.com",
    location: "San Jose, CA",
    founded: "1998",
    employees: "30,000+",
    rating: 4.3,
    reviews: 6547,
    integrations: ["Checkout", "Payouts", "Braintree"],
    verified: true,
  },
  {
    id: "8",
    name: "Segment",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=100&fit=crop",
    category: "analytics",
    tier: "gold",
    description: "Customer data platform that helps collect, clean, and control data.",
    website: "https://segment.com",
    location: "San Francisco, CA",
    founded: "2011",
    employees: "1,000+",
    rating: 4.6,
    reviews: 1234,
    integrations: ["Sources", "Destinations", "Audiences"],
    verified: true,
  },
  {
    id: "9",
    name: "Hotjar",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=100&fit=crop",
    category: "analytics",
    tier: "silver",
    description: "Behavior analytics tool that shows how visitors use your site.",
    website: "https://hotjar.com",
    location: "Malta, EU",
    founded: "2014",
    employees: "200+",
    rating: 4.5,
    reviews: 892,
    integrations: ["Recordings", "Heatmaps", "Surveys"],
    verified: true,
  },
  {
    id: "10",
    name: "Intercom",
    logo: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=200&h=100&fit=crop",
    category: "support",
    tier: "gold",
    description: "Customer messaging platform for sales, marketing, and support.",
    website: "https://intercom.com",
    location: "San Francisco, CA",
    founded: "2011",
    employees: "1,500+",
    rating: 4.7,
    reviews: 1876,
    integrations: ["Chat", "Email", "Bots"],
    verified: true,
  },
  {
    id: "11",
    name: "UPS",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=100&fit=crop",
    category: "logistics",
    tier: "gold",
    description: "Global logistics company offering package and freight delivery.",
    website: "https://ups.com",
    location: "Atlanta, GA",
    founded: "1907",
    employees: "500,000+",
    rating: 4.2,
    reviews: 4521,
    integrations: ["Shipping", "Tracking", "Freight"],
    verified: true,
  },
  {
    id: "12",
    name: "FedEx",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=100&fit=crop",
    category: "logistics",
    tier: "gold",
    description: "International courier delivery services company.",
    website: "https://fedex.com",
    location: "Memphis, TN",
    founded: "1971",
    employees: "400,000+",
    rating: 4.1,
    reviews: 3892,
    integrations: ["Express", "Ground", "Freight"],
    verified: true,
  },
];

export default function PartnersDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<typeof partners[0] | null>(null);

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || partner.category === selectedCategory;
    const matchesTier = !selectedTier || partner.tier === selectedTier;
    return matchesSearch && matchesCategory && matchesTier;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
      case "gold":
        return "bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900";
      case "silver":
        return "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/partners">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Partner Directory</h1>
                <p className="text-sm text-muted-foreground">{partners.length} partners</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={cn(
            "lg:w-72 shrink-0",
            showFilters ? "block" : "hidden lg:block"
          )}>
            {/* Search */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search partners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedCategory === cat.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    )}
                  >
                    <span>{cat.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {cat.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Partner Tiers */}
            <div className="bg-card rounded-2xl border border-border/50 p-6">
              <h3 className="font-bold mb-4">Partner Tier</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTier(null)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    !selectedTier ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                  )}
                >
                  <span>All Tiers</span>
                </button>
                {partnerTiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedTier === tier.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                    )}
                  >
                    <span className={cn("px-2 py-0.5 rounded text-xs font-bold", getTierColor(tier.id))}>
                      {tier.name}
                    </span>
                    <div className="flex gap-0.5">
                      {[...Array(tier.stars)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredPartners.length}</span> partners
              </p>
              {(searchQuery || selectedCategory !== "all" || selectedTier) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedTier(null);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Partners Grid */}
            {filteredPartners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => setSelectedPartner(partner)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-muted">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Badge className={cn("font-bold text-xs", getTierColor(partner.tier))}>
                          {partner.tier}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {partner.name}
                        </h3>
                        {partner.verified && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {partner.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {partner.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {partner.integrations.length} integrations
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{partner.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({partner.reviews.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {partner.integrations.slice(0, 2).map((int) => (
                            <Badge key={int} variant="secondary" className="text-xs">
                              {int}
                            </Badge>
                          ))}
                          {partner.integrations.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{partner.integrations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
                <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-bold mb-2">No partners found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedTier(null);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/5">
              <button
                onClick={() => setSelectedPartner(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 -mt-16 relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-end gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-card border-4 border-card shadow-lg">
                    <Image
                      src={selectedPartner.logo}
                      alt={selectedPartner.name}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{selectedPartner.name}</h2>
                      {selectedPartner.verified && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <Badge className={cn("font-bold text-xs mt-1", getTierColor(selectedPartner.tier))}>
                      {selectedPartner.tier} Partner
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{selectedPartner.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{selectedPartner.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedPartner.reviews} reviews</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="font-bold mb-1">{selectedPartner.founded}</p>
                  <p className="text-xs text-muted-foreground">Founded</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="font-bold mb-1">{selectedPartner.employees}</p>
                  <p className="text-xs text-muted-foreground">Employees</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="font-bold mb-1">{selectedPartner.integrations.length}</p>
                  <p className="text-xs text-muted-foreground">Integrations</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Integrations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPartner.integrations.map((int) => (
                    <Badge key={int} variant="secondary">
                      {int}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <a
                  href={selectedPartner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </Button>
                </a>
                <Button variant="outline" className="flex-1 gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Partner
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedPartner.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
