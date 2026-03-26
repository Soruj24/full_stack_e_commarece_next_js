import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: { _id: string; name: string; slug: string }[];
  selectedCategories: string[];
  toggleCategory: (slug: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  toggleCategory,
}: CategoryFilterProps) {
  return (
    <AccordionItem value="categories" className="border-none group/item">
      <AccordionTrigger className="py-2 hover:no-underline group-hover/item:text-primary transition-colors">
        <span className="font-black text-xs uppercase tracking-[0.2em] text-foreground/80 group-hover/item:text-primary">
          Collections
        </span>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-2">
        <div className="space-y-1">
          {(categories || []).map(
            (cat: { _id: string; name: string; slug: string }) => (
              <motion.div
                key={cat._id}
                whileHover={{ x: 4 }}
                className="flex items-center space-x-3 group p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => toggleCategory(cat.slug)}
              >
                <Checkbox
                  id={`cat-${cat._id}`}
                  checked={selectedCategories.includes(cat.slug)}
                  onCheckedChange={() => toggleCategory(cat.slug)}
                  className="rounded-[6px] border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                />
                <label
                  htmlFor={`cat-${cat._id}`}
                  className={cn(
                    "text-sm font-medium leading-none cursor-pointer w-full transition-colors",
                    selectedCategories.includes(cat.slug)
                      ? "text-primary font-bold"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {cat.name}
                </label>
              </motion.div>
            ),
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
