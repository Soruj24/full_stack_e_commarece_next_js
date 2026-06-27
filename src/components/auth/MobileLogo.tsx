import { ShieldCheck } from "lucide-react";

export function MobileLogo() {
  return (
    <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
        <ShieldCheck className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="flex flex-col -space-y-1">
        <span className="text-xl font-bold tracking-tight text-foreground">
          Nexus
        </span>
        <span className="text-[8px] font-bold tracking-[0.2em] text-primary uppercase">
          Enterprise
        </span>
      </div>
    </div>
  );
}
