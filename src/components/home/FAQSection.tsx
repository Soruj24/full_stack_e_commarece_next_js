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
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Find quick answers to common questions about our products, shipping, and more.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {mounted ? (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-card border border-border/50 rounded-xl px-5 overflow-hidden"
                >
                  <AccordionTrigger className="font-medium text-[15px] hover:no-underline hover:text-primary transition-colors py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-[13px] leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="w-full space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-xl px-5 py-5">
                  <div className="font-medium text-[15px]">{faq.question}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Mail, title: "Email Support", desc: "support@example.com", color: "text-primary", bg: "bg-primary/5" },
            { icon: MessageSquare, title: "Live Chat", desc: "Available 24/7", color: "text-emerald-500", bg: "bg-emerald-500/5" },
            { icon: Phone, title: "Phone Support", desc: "+1 (555) 000-0000", color: "text-violet-500", bg: "bg-violet-500/5" }
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-xl p-6 text-center hover:border-border/80 hover:shadow-sm transition-all duration-200">
              <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <h4 className="font-semibold text-[14px] text-foreground mb-1">{item.title}</h4>
              <p className="text-muted-foreground text-[13px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
