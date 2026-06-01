"use client";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fashion Enthusiast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    title: "Best Online Shopping Experience!",
    content:
      "I've been shopping here for over a year and I couldn't be happier. The product quality is exceptional, shipping is always fast, and customer service is incredible. Highly recommend!",
    product: "Premium Wireless Headphones",
    date: "2 weeks ago",
    featured: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Tech Reviewer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    title: "Outstanding Quality",
    content:
      "The smart watch exceeded all my expectations. Build quality is premium and the price was competitive. Will definitely be purchasing more!",
    product: "Smart Watch Pro Series",
    date: "1 month ago",
    featured: false,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Lifestyle Blogger",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    title: "Love This Store!",
    content:
      "From browsing to checkout, everything was seamless. The package arrived beautifully packaged and in perfect condition. 10/10 would recommend.",
    product: "Designer Collection Bag",
    date: "3 weeks ago",
    featured: false,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Electronics Expert",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 5,
    title: "Five Stars All Around!",
    content:
      "This is my go-to store for electronics. Prices are competitive, products are authentic, and delivery is always on time. The 30-day return policy is a bonus.",
    product: "4K Ultra HD Camera",
    date: "1 week ago",
    featured: true,
  },
  {
    id: 5,
    name: "Jessica Thompson",
    role: "Verified Buyer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    rating: 5,
    title: "Absolutely Amazing!",
    content:
      "This store changed my mind about online shopping. The product photos are accurate and the overall experience has been fantastic. Thank you!",
    product: "Organic Skincare Set",
    date: "5 days ago",
    featured: false,
  },
  {
    id: 6,
    name: "Alex Turner",
    role: "Frequent Shopper",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    title: "Unmatched Value",
    content:
      "I've tried many online stores, but this one stands out for its curation and quality. Every product feels carefully selected.",
    product: "Premium Fitness Tracker",
    date: "2 days ago",
    featured: false,
  },
];

function TestimonialCard({ t, delay }: { t: typeof testimonials[0]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-3xl p-6 h-full"
      style={{
        background: t.featured
          ? "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)"
          : "rgba(255,255,255,0.025)",
        border: t.featured
          ? "1px solid rgba(139, 92, 246, 0.3)"
          : "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
        }}
      />

      <Quote
        className="absolute top-4 right-4 w-10 h-10 opacity-10"
        style={{ color: "#a78bfa" }}
      />

      {/* Verified + date */}
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-4 h-4 text-violet-400" />
        <span className="text-xs font-semibold text-violet-400">Verified Purchase</span>
        <span className="text-slate-500 text-xs ml-auto">{t.date}</span>
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>

      <h4 className="font-bold text-white text-lg mb-3 leading-tight">{t.title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>

      <p className="text-xs text-slate-500 mb-4">
        Purchased: <span className="text-slate-300 font-semibold">{t.product}</span>
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Avatar className="w-10 h-10 ring-2" style={{ boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.3)" }}>
          <AvatarImage src={t.avatar} alt={t.name} />
          <AvatarFallback className="bg-violet-600 text-white text-xs font-bold">
            {t.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white font-bold text-sm">{t.name}</p>
          <p className="text-slate-500 text-xs">{t.role}</p>
        </div>
        {t.featured && (
          <Badge
            className="ml-auto text-[10px] font-bold text-violet-300 border-violet-500/30"
            style={{ background: "rgba(139, 92, 246, 0.15)" }}
          >
            Top Review
          </Badge>
        )}
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const summary = [
    { label: "Average Rating", value: "4.9/5" },
    { label: "Total Reviews", value: "12,000+" },
    { label: "Satisfaction Rate", value: "98%" },
  ];

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #07050f 0%, #0a0514 50%, #07050f 100%)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139, 92, 246, 0.02) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(139, 92, 246, 0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              color: "#a78bfa",
            }}
          >
            <Star className="w-4 h-4 fill-current" />
            Customer Reviews
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            What Our{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #e879f9 100%)" }}
            >
              Customers Say
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what real customers say about their experience.
          </p>

          {/* Summary stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {summary.map((s) => (
              <div
                key={s.label}
                className="px-6 py-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-xl font-black text-violet-400">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} t={t} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
