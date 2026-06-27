"use client";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TestimonialData } from "@/lib/data/testimonials-data";

interface TestimonialCardProps {
  t: TestimonialData;
  delay: number;
}

export function TestimonialCard({ t, delay }: TestimonialCardProps) {
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
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)" }}
      />
      <Quote className="absolute top-4 right-4 w-10 h-10 opacity-10" style={{ color: "#a78bfa" }} />
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-4 h-4 text-violet-400" />
        <span className="text-xs font-semibold text-violet-400">Verified Purchase</span>
        <span className="text-slate-500 text-xs ml-auto">{t.date}</span>
      </div>
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
