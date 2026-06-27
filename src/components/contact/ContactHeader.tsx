import { Mail, Phone, MapPin, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export function ContactHeader() {
  return (
    <div className="relative bg-gradient-to-b from-background to-muted/30 border-b border-border/40 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-6 py-32 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-10"
        >
          <Headphones className="h-4 w-4" />
          24/7 Customer Support
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tight"
        >
          Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Touch</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Have a question or need help? Our friendly support team is here for you. 
          We typically respond within 24 hours.
        </motion.p>
      </div>
    </div>
  );
}
