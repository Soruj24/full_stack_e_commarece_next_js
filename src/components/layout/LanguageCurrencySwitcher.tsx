"use client";

import { useSyncExternalStore } from "react";
import { useLocalization } from "@/modules/common/hooks/LocalizationContext";
import { languages, currencies } from "@/lib/localization";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const empty = () => () => {};

export function LanguageCurrencySwitcher() {
  const mounted = useSyncExternalStore(empty, () => true, () => false);
  const { language, currency: curCode, setLanguage, setCurrency } = useLocalization();

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-7 px-1.5 gap-1 rounded-md text-[11px] font-medium">
        <Globe className="w-3 h-3 text-muted-foreground" />
      </Button>
    );
  }

  const lang = languages.find((l) => l.code === language) || languages[0];
  const cur = currencies.find((c) => c.code === curCode) || currencies[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors h-7 px-1.5 rounded-md hover:bg-muted/50">
          <span className="text-xs leading-none">{lang.flag}</span>
          <span className="uppercase tracking-wide">{lang.code}</span>
          <ChevronDown className="w-2.5 h-2.5 opacity-40" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5 shadow-xl border-border/40 mt-2">
        <DropdownMenuLabel className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider px-2 py-1">Language</DropdownMenuLabel>
        {languages.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => setLanguage(l.code)}
            className={cn("rounded-lg gap-2.5 font-medium cursor-pointer py-1.5 focus:bg-muted/50 text-[12px]", language === l.code && "bg-primary/5 text-primary")}>
            <span className="text-xs">{l.flag}</span>
            <span className="flex-1">{l.name}</span>
            {language === l.code && <Check className="w-3 h-3" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuLabel className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider px-2 py-1">Currency</DropdownMenuLabel>
        {currencies.map((c) => (
          <DropdownMenuItem key={c.code} onClick={() => setCurrency(c.code)}
            className={cn("rounded-lg gap-2.5 font-medium cursor-pointer py-1.5 focus:bg-muted/50 text-[12px]", curCode === c.code && "bg-primary/5 text-primary")}>
            <span className="w-4 h-4 rounded text-[9px] flex items-center justify-center bg-muted/50">{c.symbol}</span>
            <span className="flex-1 uppercase tracking-wide">{c.code}</span>
            {curCode === c.code && <Check className="w-3 h-3" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageCurrencySwitcher;
