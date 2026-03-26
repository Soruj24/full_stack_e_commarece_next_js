"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Truck, RefreshCcw, CreditCard, ShieldCheck } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";

const faqs = [
  {
    category: "Shipping",
    icon: Truck,
    questions: [
      {
        q: "How long does shipping take?",
        a: "Domestic orders typically arrive in 3-5 business days. International shipping can take 7-14 business days depending on the destination."
      },
      {
        q: "Can I track my order?",
        a: "Yes! Once your order ships, you'll receive an email with a tracking number and a link to track your package in real-time."
      }
    ]
  },
  {
    category: "Returns",
    icon: RefreshCcw,
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, you can return it within 30 days for a full refund."
      }
    ]
  },
  {
    category: "Payments",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, PayPal, and Apple Pay. For some regions, we also offer local payment methods."
      }
    ]
  },
  {
    category: "Security",
    icon: ShieldCheck,
    questions: [
      {
        q: "Is my data secure?",
        a: "Absolutely. We use industry-standard encryption and security protocols to ensure your personal and payment information is always protected."
      }
    ]
  }
];

export function FAQ() {
  const mounted = useMounted();

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight mb-4 flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary" />
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about our products and services.</p>
        </div>

        <div className="grid gap-8">
          {faqs.map((category, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <category.icon className="w-5 h-5" />
                {category.category}
              </h3>
              {mounted ? (
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {category.questions.map((faq, fIdx) => (
                    <AccordionItem 
                      key={fIdx} 
                      value={`${idx}-${fIdx}`}
                      className="bg-card border border-border/50 rounded-2xl px-6 overflow-hidden data-[state=open]:border-primary/30 transition-all"
                    >
                      <AccordionTrigger className="hover:no-underline py-4 font-bold text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="w-full space-y-3">
                  {category.questions.map((faq, fIdx) => (
                    <div key={fIdx} className="bg-card border border-border/50 rounded-2xl px-6 py-4 font-bold text-left">
                      {faq.q}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
