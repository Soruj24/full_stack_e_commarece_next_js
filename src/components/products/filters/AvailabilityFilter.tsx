import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AvailabilityFilterProps {
  inStock: boolean;
  setInStock: (inStock: boolean) => void;
}

export function AvailabilityFilter({ inStock, setInStock }: AvailabilityFilterProps) {
  return (
    <AccordionItem value="availability" className="border-none pt-4 group/item">
      <AccordionTrigger className="py-2 hover:no-underline">
        <span className="font-black text-xs uppercase tracking-[0.2em] text-foreground/80 group-hover/item:text-primary transition-colors">
          Availability
        </span>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-2">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center space-x-3 group p-3 rounded-xl border transition-all cursor-pointer",
            inStock 
              ? "bg-primary/5 border-primary/20" 
              : "bg-muted/30 border-border/40 hover:border-primary/20"
          )}
          onClick={() => setInStock(!inStock)}
        >
          <Checkbox
            id="in-stock"
            checked={inStock}
            onCheckedChange={(checked) => setInStock(checked as boolean)}
            className="rounded-[6px] border-border/60 data-[state=checked]:bg-primary"
          />
          <label
            htmlFor="in-stock"
            className={cn(
              "text-sm font-medium leading-none cursor-pointer w-full transition-colors",
              inStock ? "text-foreground font-bold" : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            In Stock Only
          </label>
        </motion.div>
      </AccordionContent>
    </AccordionItem>
  );
}
