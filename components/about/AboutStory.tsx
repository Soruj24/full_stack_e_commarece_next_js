"use client";

import { Award, Heart, Users, Globe } from "lucide-react";
import Image from "next/image";

export function AboutStory() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              Our Story
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
              From First Order <br />
              <span className="text-primary italic">
                To 50,000+ Customers.
              </span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              Founded in 2024, we started with a simple mission: make online shopping 
              better. Today, we serve customers across 120+ countries, offering 
              premium products at unbeatable prices with exceptional service.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="flex items-start gap-5 group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-foreground uppercase tracking-widest text-xs mb-2">
                    Customer First
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every decision we make starts with asking: how does this help our customers?
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5 group">
                <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-border/40 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-foreground uppercase tracking-widest text-xs mb-2">
                    Quality Assured
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Handpicked products with rigorous quality checks before they reach you.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-10 bg-primary/5 rounded-[80px] blur-[120px]" />
            <div className="relative rounded-[60px] overflow-hidden shadow-2xl shadow-primary/10 border-[12px] border-background">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=800&fit=crop"
                alt="Our Store"
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
