import { CreditCard, Gift, Check } from "lucide-react";

const features = [
  { icon: CreditCard, title: "Instant Delivery", desc: "Gift cards are delivered via email immediately" },
  { icon: Gift, title: "No Expiry", desc: "Valid for 12 months from purchase date" },
  { icon: Check, title: "Easy to Use", desc: "Apply at checkout in seconds" },
];

export function GiftCardFeatures() {
  return (
    <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
      {features.map((f) => (
        <div key={f.title} className="p-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <f.icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold mb-1">{f.title}</h3>
          <p className="text-sm text-muted-foreground">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
