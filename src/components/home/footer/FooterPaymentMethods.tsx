import { PAYMENT_ICONS } from "@/lib/data/footer";

export function FooterPaymentMethods() {
  return (
    <div className="py-6 mb-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Secure Payment Methods</p>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_ICONS.map((p) => (
            <div
              key={p}
              className="px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-wider"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
