import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BrandFilterProps {
  brands: string[];
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
}

export function BrandFilter({ brands, selectedBrands, toggleBrand }: BrandFilterProps) {
  return (
    <AccordionItem value="brands" className="border-none pt-4 group/item">
      <AccordionTrigger className="py-2 hover:no-underline">
        <span className="font-black text-xs uppercase tracking-[0.2em] text-foreground/80 group-hover/item:text-primary transition-colors">
          Brands
        </span>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-2">
         <ScrollArea className="h-[140px] pr-3 -mr-3">
          <div className="space-y-1">
            {(brands || []).map((brand) => (
              <motion.div 
                key={brand} 
                whileHover={{ x: 4 }}
                className="flex items-center space-x-3 group p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => toggleBrand(brand)}
              >
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                  className="rounded-[6px] border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className={cn(
                    "text-sm font-medium leading-none cursor-pointer w-full transition-colors",
                    selectedBrands.includes(brand) ? "text-primary font-bold" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {brand}
                </label>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );
}
