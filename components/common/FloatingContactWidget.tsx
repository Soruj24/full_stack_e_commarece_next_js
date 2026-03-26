"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    toast.success("Message sent! We'll get back to you soon.");
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 bg-card border border-border rounded-3xl shadow-2xl shadow-primary/10 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary to-purple-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Chat with Us</h3>
                  <p className="text-sm text-white/80">We typically reply in minutes</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>support@myshop.com</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
              
              <div className="relative">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pr-12"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                  onClick={handleSend}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-500 text-white shadow-2xl shadow-primary/30 flex items-center justify-center transition-all duration-300 ${
          isOpen ? "rotate-45" : ""
        }`}
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
      </motion.button>

      <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-card animate-pulse" />
    </div>
  );
}
