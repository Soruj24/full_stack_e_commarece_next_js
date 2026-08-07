import { TRUST_FEATURES } from "@/lib/data/footer";

export function FooterTrustFeatures() {
  return (
    <div className="border-b border-border/40 bg-surface/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST_FEATURES.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-foreground text-[13px] font-semibold">{feature.label}</p>
                <p className="text-muted-foreground text-[11px]">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
