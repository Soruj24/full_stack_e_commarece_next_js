import Image from "next/image";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredPartners, integrationCategories } from "@/lib/data/partners";

export function PartnersGridSection() {
  return (
    <>
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Our Featured Partners</h2>
            <p className="text-muted-foreground">Join hundreds of leading companies that trust and rely on our platform.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredPartners.map((partner) => (
              <div key={partner.id} className="bg-card rounded-2xl border border-border/50 p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                <div className="w-full h-16 relative mb-4">
                  <Image src={partner.logo} alt={partner.name} fill className="object-contain grayscale hover:grayscale-0 transition-all" />
                </div>
                <h4 className="font-bold text-sm mb-1">{partner.name}</h4>
                <p className="text-xs text-muted-foreground">{partner.category}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/partners/directory">
              <Button variant="outline" className="rounded-xl">View All Partners <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Integration Ecosystem</h2>
            <p className="text-muted-foreground">Connect with the tools and services you already use.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {integrationCategories.map((cat) => (
              <div key={cat.name} className="bg-card rounded-xl border border-border/50 p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-sm mb-1">{cat.name}</h4>
                <p className="text-xs text-muted-foreground">{cat.count} integrations</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
