"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  Handshake, 
  TrendingUp, 
  Globe, 
  Award, 
  Star,
  CheckCircle2,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Shield,
  Zap,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const partnershipTypes = [
  {
    id: "reseller",
    title: "Reseller Partners",
    description: "Become a reseller and earn competitive margins on every sale.",
    icon: TrendingUp,
    benefits: [
      "Up to 40% commission on sales",
      "Dedicated account manager",
      "Marketing materials & resources",
      "Priority support",
      "Early access to new features",
    ],
  },
  {
    id: "integration",
    title: "Integration Partners",
    description: "Integrate your platform with ours to offer seamless solutions.",
    icon: Zap,
    benefits: [
      "API access & documentation",
      "Technical support & guidance",
      "Joint marketing opportunities",
      "Partner directory listing",
      "Co-branded solutions",
    ],
  },
  {
    id: "referral",
    title: "Referral Partners",
    description: "Refer clients and earn rewards for every successful referral.",
    icon: Heart,
    benefits: [
      "15% recurring commission",
      "Performance bonuses",
      "Sales enablement tools",
      "Co-selling opportunities",
      "VIP partner events",
    ],
  },
  {
    id: "strategic",
    title: "Strategic Partners",
    description: "Build long-term partnerships for mutual growth and success.",
    icon: Handshake,
    benefits: [
      "Custom partnership agreements",
      "Executive sponsorship",
      "Strategic planning sessions",
      "Exclusive insights & data",
      "Innovation collaboration",
    ],
  },
];

const featuredPartners = [
  {
    id: "1",
    name: "TechCorp Solutions",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=100&fit=crop",
    category: "Technology",
    description: "Leading provider of enterprise software solutions",
    website: "https://example.com",
  },
  {
    id: "2",
    name: "CloudFirst Inc",
    logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=100&fit=crop",
    category: "Cloud Services",
    description: "Enterprise cloud infrastructure provider",
    website: "https://example.com",
  },
  {
    id: "3",
    name: "DataSync Pro",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=100&fit=crop",
    category: "Data Analytics",
    description: "Advanced analytics and business intelligence",
    website: "https://example.com",
  },
  {
    id: "4",
    name: "PayEasy",
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=100&fit=crop",
    category: "Payments",
    description: "Global payment processing solutions",
    website: "https://example.com",
  },
  {
    id: "5",
    name: "ShipFast Logistics",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=100&fit=crop",
    category: "Logistics",
    description: "Fast and reliable shipping services",
    website: "https://example.com",
  },
  {
    id: "6",
    name: "SecureAuth",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=100&fit=crop",
    category: "Security",
    description: "Enterprise-grade authentication solutions",
    website: "https://example.com",
  },
];

const stats = [
  { label: "Active Partners", value: "500+", icon: Users },
  { label: "Countries", value: "45+", icon: Globe },
  { label: "Partner Revenue", value: "$50M+", icon: TrendingUp },
  { label: "Avg. Partner Rating", value: "4.9", icon: Star },
];

const integrationCategories = [
  { name: "Payment Gateways", count: 12 },
  { name: "Shipping Providers", count: 8 },
  { name: "CRM Systems", count: 6 },
  { name: "Marketing Tools", count: 15 },
  { name: "Analytics", count: 9 },
  { name: "Accounting", count: 5 },
];

const testimonials = [
  {
    id: "1",
    quote: "Partnering with this platform has been transformative for our business. The support and resources they provide are exceptional.",
    author: "Sarah Mitchell",
    role: "CEO, TechCorp Solutions",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    quote: "We've seen incredible growth since becoming a reseller partner. The commission structure and support are unmatched.",
    author: "James Rodriguez",
    role: "VP Sales, CloudFirst Inc",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    quote: "The integration was seamless and their technical team was incredibly helpful throughout the process.",
    author: "Emily Chen",
    role: "CTO, DataSync Pro",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

export default function PartnersPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    partnershipType: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Application submitted!", {
      description: "We'll review your application and get back to you within 48 hours.",
    });
    
    setShowContactForm(false);
    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      partnershipType: "",
      message: "",
    });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Handshake className="w-4 h-4" />
              Partner Program
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Grow Together with <span className="text-primary">Strategic Partnerships</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our global network of partners and unlock new revenue streams, 
              access powerful tools, and accelerate your business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="rounded-xl px-8 h-14 text-lg font-bold"
                onClick={() => setShowContactForm(true)}
              >
                Become a Partner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link href="/partners/directory">
                <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 text-lg font-bold">
                  Partner Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Partnership Programs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the partnership model that best fits your business goals and start growing with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnershipTypes.map((type) => (
              <div
                key={type.id}
                className={cn(
                  "bg-card rounded-3xl border border-border/50 p-8 transition-all cursor-pointer",
                  selectedType === type.id
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "hover:border-primary/50"
                )}
                onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <type.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                    <p className="text-muted-foreground">{type.description}</p>
                  </div>
                </div>

                {selectedType === type.id && (
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                      Benefits Include
                    </h4>
                    <ul className="space-y-3">
                      {type.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, partnershipType: type.title });
                        setShowContactForm(true);
                      }}
                    >
                      Apply Now
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Our Featured Partners</h2>
            <p className="text-muted-foreground">
              Join hundreds of leading companies that trust and rely on our platform.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredPartners.map((partner) => (
              <div
                key={partner.id}
                className="bg-card rounded-2xl border border-border/50 p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-16 relative mb-4">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain grayscale hover:grayscale-0 transition-all"
                  />
                </div>
                <h4 className="font-bold text-sm mb-1">{partner.name}</h4>
                <p className="text-xs text-muted-foreground">{partner.category}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/partners/directory">
              <Button variant="outline" className="rounded-xl">
                View All Partners
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Integration Ecosystem</h2>
            <p className="text-muted-foreground">
              Connect with the tools and services you already use.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {integrationCategories.map((category) => (
              <div
                key={category.name}
                className="bg-card rounded-xl border border-border/50 p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-sm mb-1">{category.name}</h4>
                <p className="text-xs text-muted-foreground">{category.count} integrations</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">What Partners Say</h2>
            <p className="text-muted-foreground">
              Hear from some of our valued partnership members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-card rounded-3xl border border-border/50 p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Why Partner With <span className="text-primary">Us?</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Revenue Growth</h4>
                    <p className="text-sm text-muted-foreground">
                      Unlock new revenue streams with competitive commissions and performance bonuses.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Reliable Platform</h4>
                    <p className="text-sm text-muted-foreground">
                      Built on enterprise-grade infrastructure with 99.9% uptime guarantee.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Dedicated Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Get a dedicated account manager and 24/7 technical support.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Exclusive Benefits</h4>
                    <p className="text-sm text-muted-foreground">
                      Access exclusive resources, training, and partner-only events.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join our partner program today and start growing your business.
              </p>
              <Button 
                size="lg" 
                className="rounded-xl px-8"
                onClick={() => setShowContactForm(true)}
              >
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Become a Partner</h2>
                <p className="text-sm text-muted-foreground">
                  Fill out the form below and we'll get back to you within 48 hours.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowContactForm(false)}
              >
                ×
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Acme Inc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@acme.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://acme.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnershipType">Partnership Type *</Label>
                  <select
                    id="partnershipType"
                    value={formData.partnershipType}
                    onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select type...</option>
                    {partnershipTypes.map((type) => (
                      <option key={type.id} value={type.title}>
                        {type.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your company and partnership goals..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Info */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Have Questions?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">partners@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Office</p>
                <p className="font-medium">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Send(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
