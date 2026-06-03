import { TrendingUp, Shield, Users, Award, ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onCtaClick: () => void;
}

export function WhyPartnerSection({ onCtaClick }: Props) {
  return (
    <>
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6">Why Partner With <span className="text-primary">Us?</span></h2>
              <div className="space-y-6">
                {[
                  { icon: TrendingUp, title: "Revenue Growth", desc: "Unlock new revenue streams with competitive commissions and performance bonuses." },
                  { icon: Shield, title: "Reliable Platform", desc: "Built on enterprise-grade infrastructure with 99.9% uptime guarantee." },
                  { icon: Users, title: "Dedicated Support", desc: "Get a dedicated account manager and 24/7 technical support." },
                  { icon: Award, title: "Exclusive Benefits", desc: "Access exclusive resources, training, and partner-only events." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{title}</h4>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">Join our partner program today and start growing your business.</p>
              <Button size="lg" className="rounded-xl px-8" onClick={onCtaClick}>
                Apply Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Have Questions?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {[
              { icon: Mail, label: "Email", value: "partners@example.com" },
              { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
              { icon: MapPin, label: "Office", value: "San Francisco, CA" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
