"use client";

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image:
      "https://picsum.photos/seed/sarah/400/400",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image:
      "https://picsum.photos/seed/michael/400/400",
  },
  {
    name: "Emily Davis",
    role: "Head of Product",
    image:
      "https://picsum.photos/seed/emily/400/400",
  },
];

export function AboutTeam() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            Core Architects
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
            Meet the <br />
            <span className="text-primary italic">Engineers.</span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium">
            The visionary minds architecting the next generation of secure identity protocols.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {team.map((member, index) => (
            <div key={index} className="group relative">
              <div className="relative overflow-hidden rounded-[48px] mb-8 aspect-square border-4 border-muted/30 group-hover:border-primary/20 transition-all duration-500 shadow-2xl shadow-primary/5">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">
                {member.name}
              </h3>
              <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mt-2">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
