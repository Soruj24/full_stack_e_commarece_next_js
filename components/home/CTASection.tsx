import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

export function CTASection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0d0520 0%, #0f0030 25%, #0a0020 50%, #050015 100%)",
      }}
    >
      {/* Animated gradient orbs */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.6) 30%, rgba(232,121,249,0.6) 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(232, 121, 249, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-8"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          Join 50,000+ Happy Customers
        </div>

        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
          Ready to Start{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #e879f9 100%)",
            }}
          >
            Shopping?
          </span>
        </h2>

        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Create your free account today and unlock exclusive deals, faster checkout,
          and personalized recommendations tailored just for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="h-14 px-10 rounded-2xl text-base font-bold group"
            style={{
              background: "white",
              color: "#6366f1",
              boxShadow: "0 0 40px rgba(255,255,255,0.2), 0 10px 30px rgba(0,0,0,0.3)",
            }}
            asChild
          >
            <Link href="/register">
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-10 rounded-2xl text-base font-bold text-white"
            style={{
              borderColor: "rgba(139, 92, 246, 0.4)",
              background: "rgba(139, 92, 246, 0.1)",
            }}
            asChild
          >
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
          {[
            "No credit card required",
            "Free account forever",
            "Cancel anytime",
          ].map((text) => (
            <span key={text} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
