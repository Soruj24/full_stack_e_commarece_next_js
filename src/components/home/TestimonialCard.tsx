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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="group bg-card border border-border/50 rounded-xl p-5 h-full hover:border-border/80 hover:shadow-sm transition-all duration-200 relative"
    >
      <Quote className="absolute top-4 right-4 w-8 h-8 text-muted-foreground/[0.07]" />

      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-3.5 h-3.5 text-primary" />
        <span className="text-[11px] font-medium text-primary">Verified Purchase</span>
        <span className="text-muted-foreground text-[11px] ml-auto">{t.date}</span>
      </div>

      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        ))}
      </div>

      <h4 className="font-semibold text-foreground text-[15px] mb-2 leading-snug">{t.title}</h4>
      <p className="text-muted-foreground text-[13px] leading-relaxed mb-4">&ldquo;{t.content}&rdquo;</p>
      <p className="text-[11px] text-muted-foreground mb-4">
        Purchased: <span className="text-foreground font-medium">{t.product}</span>
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-border/40">
        <Avatar className="w-9 h-9">
          <AvatarImage src={t.avatar} alt={t.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">
            {t.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-foreground font-medium text-[13px]">{t.name}</p>
          <p className="text-muted-foreground text-[11px]">{t.role}</p>
        </div>
        {t.featured && (
          <Badge className="ml-auto text-[10px] font-medium bg-primary/10 text-primary border-0">
            Top Review
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
