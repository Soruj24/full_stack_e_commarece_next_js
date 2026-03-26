"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "support@myshop.com",
    subDetails: "We reply within 24 hours",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+1 (555) 123-4567",
    subDetails: "Mon-Fri, 9am-6pm EST",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    details: "Chat with us",
    subDetails: "Available 24/7",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    details: "Browse FAQs",
    subDetails: "Quick answers to common questions",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
  },
];

export function ContactInfoCards() {
  return (
    <div className="lg:col-span-1 space-y-6">
      {contactInfo.map((info, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className="bg-card border border-border rounded-3xl p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${info.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <info.icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  {info.title}
                </h3>
                <p className="text-lg font-bold text-foreground">{info.details}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {info.subDetails}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary to-purple-500 rounded-3xl p-6 text-white"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Visit Our Store</h3>
            <p className="text-white/80 text-sm">123 Commerce Street, NY 10001</p>
          </div>
        </div>
        <p className="text-white/80 text-sm">
          Come visit us in person! Our retail location is open Monday through Saturday.
        </p>
      </motion.div>
    </div>
  );
}
