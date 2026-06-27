import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface PriceFilterProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  maxPrice?: number;
}

export function PriceFilter({ priceRange, setPriceRange, maxPrice = 2000 }: PriceFilterProps) {
  return (
    <AccordionItem value="price" className="border-none pt-4 group/item">
      <AccordionTrigger className="py-2 hover:no-underline">
        <span className="font-black text-xs uppercase tracking-[0.2em] text-foreground/80 group-hover/item:text-primary transition-colors">
          Price Range
        </span>
      </AccordionTrigger>
      <AccordionContent className="pt-6 pb-2 px-1">
        <Slider
          defaultValue={[0, maxPrice]}
          max={maxPrice}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-6"
        />
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">$</span>
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="h-9 pl-6 pr-2 rounded-lg bg-muted/30 border-border/50 text-xs font-bold hover:bg-muted/50 focus:bg-background transition-colors"
            />
          </div>
          <span className="text-muted-foreground font-medium">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">$</span>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])}
              className="h-9 pl-6 pr-2 rounded-lg bg-muted/30 border-border/50 text-xs font-bold hover:bg-muted/50 focus:bg-background transition-colors"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
