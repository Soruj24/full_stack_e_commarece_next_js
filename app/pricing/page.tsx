"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    period: "forever",
    features: [
      { text: "5 products listing", included: true },
      { text: "Basic analytics", included: true },
      { text: "Email support", included: true },
      { text: "Mobile app access", included: true },
      { text: "Custom domain", included: false },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
      { text: "Custom branding", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    description: "Best for small businesses",
    price: 9.99,
    period: "month",
    features: [
      { text: "50 products listing", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority email support", included: true },
      { text: "Mobile app access", included: true },
      { text: "Custom domain", included: true },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
      { text: "Custom branding", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Professional",
    description: "For growing businesses",
    price: 29.99,
    period: "month",
    features: [
      { text: "Unlimited products", included: true },
      { text: "Advanced analytics", included: true },
      { text: "24/7 phone support", included: true },
      { text: "Mobile app access", included: true },
      { text: "Custom domain", included: true },
      { text: "Priority support", included: true },
      { text: "API access", included: true },
      { text: "Custom branding", included: false },
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: 99.99,
    period: "month",
    features: [
      { text: "Unlimited products", included: true },
      { text: "Custom analytics", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Mobile app access", included: true },
      { text: "Custom domain", included: true },
      { text: "Priority support", included: true },
      { text: "API access", included: true },
      { text: "Custom branding", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    q: "Can I change my plan later?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and bank transfers. Enterprise customers can pay via invoice.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! All paid plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What happens if I cancel?",
    a: "You can cancel anytime. Your data will be preserved for 30 days after cancellation.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a full refund within 30 days of your first payment if you're not satisfied.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business. All plans include a 14-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-6 ${
                  plan.popular
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-black">
                    ${plan.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>

                <Button
                  className={`w-full mb-6 rounded-xl ${
                    plan.popular ? "" : "variant-outline"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground/50"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card rounded-2xl p-6">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of businesses using our platform. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="rounded-xl px-8 h-14 text-lg font-bold">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 text-lg font-bold">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
