"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Send, CheckCircle, Bell } from "lucide-react";
import { motion } from "framer-motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Thank you for subscribing! Check your inbox for confirmation.");
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background -z-10" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-[40px] blur-xl" />
          
          <div className="relative bg-card border border-border rounded-[40px] p-8 md:p-16 shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-primary to-purple-500 text-white mb-8 shadow-xl shadow-primary/30"
              >
                <Mail className="w-10 h-10" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Subscribe to Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Newsletter</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                Get exclusive deals, new arrivals, and insider-only discounts delivered straight to your inbox. 
                Join our community of 50,000+ subscribers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="h-14 pl-6 pr-4 bg-background border-2 border-border/50 focus:border-primary rounded-2xl shadow-sm text-base"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="h-14 px-8 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⟳</span> Subscribing...
                    </span>
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free to subscribe
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Weekly updates
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Unsubscribe anytime
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
