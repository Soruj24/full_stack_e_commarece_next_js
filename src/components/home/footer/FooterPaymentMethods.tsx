import { PAYMENT_ICONS } from "@/lib/data/footer";

export function FooterPaymentMethods() {
  return (
    <div className="py-5 mb-6 border-t border-b border-border/40">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">Secure Payment Methods</p>
        <div className="flex flex-wrap gap-1.5">
          {PAYMENT_ICONS.map((p) => (
            <div
              key={p}
              className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-accent/50 border border-border/40"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
