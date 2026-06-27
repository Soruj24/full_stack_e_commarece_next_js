"use client";

export function AboutHero() {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-10">
          About Us
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-foreground mb-8 tracking-tighter uppercase leading-[0.9]">
          Who We Are <br />
          <span className="text-primary italic">& What We Do.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
          We are passionate about delivering exceptional shopping experiences. 
          Our team works tirelessly to bring you the best products, prices, and service.
        </p>
      </div>
    </section>
  );
}
