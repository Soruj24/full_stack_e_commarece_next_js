import { Lock, LucideIcon } from "lucide-react";

interface AuthFooterProps {
  icon?: LucideIcon;
  text: string;
}

export function AuthFooter({ icon: Icon = Lock, text }: AuthFooterProps) {
  return (
    <div className="mt-12 text-center">
      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-muted/30 backdrop-blur-md border border-border/40 text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] mx-auto shadow-sm">
        <Icon className="w-3.5 h-3.5 text-primary" />
        <span className="opacity-80">{text}</span>
      </div>
    </div>
  );
}
