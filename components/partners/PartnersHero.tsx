"use client";

import { Handshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { stats } from "@/lib/data/partners";

interface Props {
  onCtaClick: () => void;
}

export function PartnersHero({ onCtaClick }: Props) {
  return (
    <>
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Handshake className="w-4 h-4" /> Partner Program
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Grow Together with <span className="text-primary">Strategic Partnerships</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our global network of partners and unlock new revenue streams, access powerful tools, and accelerate your business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-xl px-8 h-14 text-lg font-bold" onClick={onCtaClick}>
                Become a Partner <ArrowRight className="w-5 h-5 ml-2" />
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
    </>
  );
}
