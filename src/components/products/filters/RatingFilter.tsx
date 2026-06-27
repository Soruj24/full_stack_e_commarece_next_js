import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RatingFilterProps {
  minRating: number;
  setMinRating: (rating: number) => void;
}

export function RatingFilter({ minRating, setMinRating }: RatingFilterProps) {
  return (
    <AccordionItem value="rating" className="border-none pt-4 group/item">
      <AccordionTrigger className="py-2 hover:no-underline">
        <span className="font-black text-xs uppercase tracking-[0.2em] text-foreground/80 group-hover/item:text-primary transition-colors">
          Minimum Rating
        </span>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-2">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <motion.button
              key={rating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-xl transition-all border",
                minRating === rating
                  ? "bg-primary/10 border-primary/20 text-primary shadow-sm"
                  : "bg-transparent border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3.5 h-3.5",
                          i < rating ? "fill-current text-current" : "fill-muted/20 text-muted/20"
                        )}
                      />
                    ))}
                </div>
              </div>
              <span className="text-xs font-bold opacity-80">& Up</span>
            </motion.button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
