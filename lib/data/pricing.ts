export interface PricingPlan {
  name: string;
  description: string;
  price: number;
  period: string;
  features: { text: string; included: boolean }[];
  cta: string;
  popular: boolean;
}

export const PLANS: PricingPlan[] = [
  {
    name: "Free", description: "Perfect for getting started", price: 0, period: "forever",
    features: [
      { text: "5 products listing", included: true }, { text: "Basic analytics", included: true },
      { text: "Email support", included: true }, { text: "Mobile app access", included: true },
      { text: "Custom domain", included: false }, { text: "Priority support", included: false },
      { text: "API access", included: false }, { text: "Custom branding", included: false },
    ],
    cta: "Get Started", popular: false,
  },
  {
    name: "Starter", description: "Best for small businesses", price: 9.99, period: "month",
    features: [
      { text: "50 products listing", included: true }, { text: "Advanced analytics", included: true },
      { text: "Priority email support", included: true }, { text: "Mobile app access", included: true },
      { text: "Custom domain", included: true }, { text: "Priority support", included: false },
      { text: "API access", included: false }, { text: "Custom branding", included: false },
    ],
    cta: "Start Free Trial", popular: true,
  },
  {
    name: "Professional", description: "For growing businesses", price: 29.99, period: "month",
    features: [
      { text: "Unlimited products", included: true }, { text: "Advanced analytics", included: true },
      { text: "24/7 phone support", included: true }, { text: "Mobile app access", included: true },
      { text: "Custom domain", included: true }, { text: "Priority support", included: true },
      { text: "API access", included: true }, { text: "Custom branding", included: false },
    ],
    cta: "Start Free Trial", popular: false,
  },
  {
    name: "Enterprise", description: "For large organizations", price: 99.99, period: "month",
    features: [
      { text: "Unlimited products", included: true }, { text: "Custom analytics", included: true },
      { text: "Dedicated account manager", included: true }, { text: "Mobile app access", included: true },
      { text: "Custom domain", included: true }, { text: "Priority support", included: true },
      { text: "API access", included: true }, { text: "Custom branding", included: true },
    ],
    cta: "Contact Sales", popular: false,
  },
];

export const PRICING_FAQS = [
  { q: "Can I change my plan later?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfers. Enterprise customers can pay via invoice." },
  { q: "Is there a free trial?", a: "Yes! All paid plans come with a 14-day free trial. No credit card required to start." },
  { q: "What happens if I cancel?", a: "You can cancel anytime. Your data will be preserved for 30 days after cancellation." },
  { q: "Do you offer refunds?", a: "We offer a full refund within 30 days of your first payment if you're not satisfied." },
];
