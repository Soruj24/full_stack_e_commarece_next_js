import { Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface FilterHeaderProps {
  activeCount: number;
  keyword: string;
  setKeyword: (value: string) => void;
}

export function FilterHeader({ activeCount, keyword, setKeyword }: FilterHeaderProps) {
  return (
    <div className="p-6 border-b border-border/40 bg-muted/20 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-foreground">Filters</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Refine Selection
            </p>
          </div>
        </div>
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Badge variant="secondary" className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90">
                {activeCount} Active
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="h-10 pl-10 rounded-xl bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm hover:bg-background/80 focus:bg-background"
        />
      </div>
    </div>
  );
}
