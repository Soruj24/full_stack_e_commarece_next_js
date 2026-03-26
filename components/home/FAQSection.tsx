"use client";

import { useSyncExternalStore } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react";

const emptySubscribe = () => () => {};

const faqs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order by going to your Profile > Orders and clicking on the 'Track' button next to your active order."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day money-back guarantee on all products. Items must be in their original packaging and condition."
  },
  {
    question: "How do I earn loyalty points?",
    answer: "You earn 1 point for every $1 spent. You can also earn points by referring friends to our platform!"
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location."
  },
  {
    question: "How can I contact support?",
    answer: "You can use our Live Chat feature in the bottom right corner, or email us at support@example.com."
  }
];

export function FAQSection() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-black text-xs uppercase tracking-widest mb-4">
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to common questions about our products, shipping, and loyalty program.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {mounted ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`}
                  className="bg-card border border-border/50 rounded-2xl px-6 overflow-hidden"
                >
                  <AccordionTrigger className="font-bold text-lg hover:no-underline hover:text-primary transition-colors py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-2xl px-6 py-6">
                  <div className="font-bold text-lg">{faq.question}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Mail, title: "Email Support", desc: "support@example.com", color: "bg-blue-500" },
            { icon: MessageSquare, title: "Live Chat", desc: "Available 24/7", color: "bg-green-500" },
            { icon: Phone, title: "Phone Support", desc: "+1 (555) 000-0000", color: "bg-purple-500" }
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-3xl p-8 text-center hover:border-primary/30 transition-all group">
              <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg mb-1">{item.title}</h4>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
