"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Send, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const avatarColors = [
  "bg-violet-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-fuchsia-500",
];
const initials = ["SJ", "MC", "ER", "DK", "JT"];

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      toast.success("🎉 Welcome! Check your inbox for a confirmation email.");
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #07050f 0%, #0c0820 50%, #07050f 100%)" }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
              boxShadow: "0 0 40px rgba(139, 92, 246, 0.5), 0 10px 30px rgba(0,0,0,0.4)",
            }}
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              color: "#a78bfa",
            }}
          >
            <Sparkles className="w-4 h-4" />
            Exclusive Subscriber Perks
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-5">
            Join Our{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #e879f9 100%)" }}
            >
              Inner Circle
            </span>
          </h2>

          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Get exclusive deals, early access to new arrivals, and insider discounts delivered to your inbox every week.
          </p>

          {/* Social proof avatars */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex -space-x-2">
              {initials.map((init, i) => (
                <Avatar
                  key={i}
                  className={`w-9 h-9 border-2 border-[#07050f] ${avatarColors[i]} text-white text-xs font-black`}
                >
                  <AvatarFallback className={`${avatarColors[i]} text-white text-[10px] font-black`}>
                    {init}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-bold">50,000+ subscribers</p>
              <p className="text-slate-500 text-xs">Join them today</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto p-2 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${isFocused ? "rgba(139, 92, 246, 0.5)" : "rgba(255,255,255,0.08)"}`,
                transition: "border-color 0.3s",
                boxShadow: isFocused ? "0 0 0 3px rgba(139, 92, 246, 0.1)" : "none",
              }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-500 text-sm font-medium outline-none"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-6 rounded-xl font-bold text-sm shrink-0"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Subscribing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Perks */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {[
              { icon: CheckCircle, text: "Free to subscribe" },
              { icon: CheckCircle, text: "Weekly exclusives" },
              { icon: CheckCircle, text: "Unsubscribe anytime" },
            ].map((p, i) => (
              <span key={i} className="flex items-center gap-1.5 text-slate-400">
                <p.icon className="w-4 h-4 text-emerald-500" />
                {p.text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
