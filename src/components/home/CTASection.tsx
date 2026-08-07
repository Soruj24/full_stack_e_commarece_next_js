import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4 text-primary-foreground/50">
          Join 50,000+ Happy Customers
        </p>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-5 leading-tight">
          Ready to Start Shopping?
        </h2>

        <p className="text-lg text-primary-foreground/70 mb-10 max-w-xl mx-auto leading-relaxed">
          Create your free account today and unlock exclusive deals, faster checkout,
          and personalized recommendations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Button
            size="lg"
            className="h-12 px-8 rounded-xl text-sm font-semibold bg-white text-primary hover:bg-white/90 group"
            asChild
          >
            <Link href="/register">
              Create Free Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 rounded-xl text-sm font-semibold border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-primary-foreground/50">
          {[
            "No credit card required",
            "Free account forever",
            "Cancel anytime",
          ].map((text) => (
            <span key={text} className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
