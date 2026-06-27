import { Briefcase } from "lucide-react";

export function CareersHero() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Briefcase className="w-4 h-4" />
          We&apos;re Hiring!
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6">
          Build the Future of <span className="text-primary">E-Commerce</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join our team of innovators and help millions of businesses succeed online.
          We&apos;re building something extraordinary, and we want you to be part of it.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {["100+ Team Members", "15+ Countries", "Remote-First"].map((stat) => (
            <div key={stat} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{stat}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
