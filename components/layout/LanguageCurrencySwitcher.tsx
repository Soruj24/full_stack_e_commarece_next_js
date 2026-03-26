"use client";

import { useSyncExternalStore } from "react";
import { useLocalization } from "@/context/LocalizationContext";
import { languages, currencies, countries } from "@/lib/localization";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function LanguageCurrencySwitcher() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const {
    language,
    currency: currentCurrencyCode,
    setLanguage,
    setCurrency,
    country,
    setCountry,
  } = useLocalization();

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 gap-1.5 rounded-xl hover:bg-muted font-bold text-xs"
        >
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="uppercase">...</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </div>
    );
  }

  const currentLang =
    languages.find((l) => l.code === language) || languages[0];
  const currentCurrency =
    currencies.find((c) => c.code === currentCurrencyCode) || currencies[0];
  const currentCountry =
    countries.find((c) => c.code === country) || countries[0];

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 gap-2 rounded-xl bg-background/50 backdrop-blur-sm border-border/50 hover:bg-muted/80 hover:border-primary/50 font-bold text-xs transition-all duration-300 group"
          >
            <span className="text-base leading-none filter drop-shadow-sm scale-110 group-hover:scale-125 transition-transform duration-300">{currentLang.flag}</span>
            <span className="uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">{currentLang.code}</span>
            <div className="w-px h-3 bg-border mx-1" />
            <span className="text-muted-foreground group-hover:text-primary transition-colors">{currentCurrency.symbol}</span>
            <span className="uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">{currentCurrency.code}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5 ml-1">
            Language
          </DropdownMenuLabel>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={cn(
                "rounded-xl gap-3 font-bold cursor-pointer py-2 focus:bg-primary/10 focus:text-primary",
                language === lang.code && "bg-primary/5 text-primary"
              )}
            >
              <span className="text-lg leading-none">{lang.flag}</span>
              <span className="flex-1">{lang.name}</span>
              {language === lang.code && <Check className="w-3.5 h-3.5" />}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator className="my-2 bg-border/50" />

          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5 ml-1">
            Currency
          </DropdownMenuLabel>
          {currencies.map((curr) => (
            <DropdownMenuItem
              key={curr.code}
              onClick={() => setCurrency(curr.code)}
              className={cn(
                "rounded-xl gap-3 font-bold cursor-pointer py-2 focus:bg-primary/10 focus:text-primary",
                currentCurrencyCode === curr.code && "bg-primary/5 text-primary"
              )}
            >
              <span className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-colors",
                currentCurrencyCode === curr.code ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
              )}>
                {curr.symbol}
              </span>
              <span className="flex-1 font-black text-xs uppercase tracking-wider">{curr.code}</span>
              {currentCurrencyCode === curr.code && <Check className="w-3.5 h-3.5" />}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator className="my-2 bg-border/50" />

          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5 ml-1">
            Country
          </DropdownMenuLabel>
          {countries.map((ct) => (
            <DropdownMenuItem
              key={ct.code}
              onClick={() => setCountry(ct.code)}
              className={cn(
                "rounded-xl gap-3 font-bold cursor-pointer py-2 focus:bg-primary/10 focus:text-primary",
                country === ct.code && "bg-primary/5 text-primary"
              )}
            >
              <span className="text-lg leading-none">{ct.flag}</span>
              <span className="flex-1">{ct.name}</span>
              {country === ct.code && <Check className="w-3.5 h-3.5" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default LanguageCurrencySwitcher;
