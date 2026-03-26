"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Verified Buyer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    title: "Best Online Shopping Experience!",
    content: "I've been shopping here for over a year now and I couldn't be happier. The product quality is exceptional, shipping is always fast, and their customer service team is incredibly helpful. Highly recommend!",
    product: "Premium Wireless Headphones",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Verified Buyer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    title: "Outstanding Quality and Service",
    content: "The smart watch I purchased exceeded all my expectations. The build quality is premium, features are exactly as described, and the price was competitive. Will definitely be purchasing more products!",
    product: "Smart Watch Pro Series",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Verified Buyer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    title: "Love This Store!",
    content: "From browsing to checkout, everything was seamless. I had a question about sizing and got a response within minutes. The package arrived beautifully packaged and in perfect condition.",
    product: "Designer Collection Bag",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Verified Buyer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 5,
    title: "Five Stars All Around!",
    content: "This is my go-to store for electronics. The prices are competitive, products are authentic, and delivery is always on time. The 30-day return policy gives me peace of mind with every purchase.",
    product: "4K Ultra HD Camera",
    date: "1 week ago",
  },
  {
    id: 5,
    name: "Jessica Thompson",
    role: "Verified Buyer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    rating: 5,
    title: "Absolutely Amazing!",
    content: "I was hesitant to buy online, but this store changed my mind. The product photos are accurate, customer reviews are helpful, and the overall experience has been fantastic. Thank you!",
    product: "Organic Skincare Set",
    date: "5 days ago",
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[current];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-4">
            Customer Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real customers have to say about their experience.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card rounded-[40px] border border-border p-8 md:p-12 shadow-2xl shadow-primary/5">
            <Quote className="absolute top-8 right-8 w-16 h-16 text-primary/10" />
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0 text-center md:text-left">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Avatar className="w-24 h-24 mx-auto md:mx-0 mb-4 ring-4 ring-primary/10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-primary/5 border-primary/20">
                        Verified Purchase
                      </Badge>
                      <span className="text-sm text-muted-foreground">{testimonial.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{testimonial.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      "{testimonial.content}"
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Purchased: <span className="font-semibold text-foreground">{testimonial.product}</span>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-border">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === current ? "bg-primary w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
