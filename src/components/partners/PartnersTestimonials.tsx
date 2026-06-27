import Image from "next/image";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/data/partners";

export function PartnersTestimonials() {
  return (
    <section className="py-20 px-4 bg-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">What Partners Say</h2>
          <p className="text-muted-foreground">Hear from some of our valued partnership members.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-card rounded-3xl border border-border/50 p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-muted-foreground mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <Image src={t.image} alt={t.author} width={48} height={48} className="rounded-full" />
                <div>
                  <h4 className="font-bold">{t.author}</h4>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
