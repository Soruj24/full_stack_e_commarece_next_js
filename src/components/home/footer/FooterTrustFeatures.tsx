import { TRUST_FEATURES } from "@/lib/data/footer";

export function FooterTrustFeatures() {
  return (
    <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_FEATURES.map((feature, index) => (
            <div key={index} className="flex items-center gap-3.5">
              <div
                className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}30` }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <div>
                <p className="text-white text-sm font-bold">{feature.label}</p>
                <p className="text-slate-500 text-xs">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
