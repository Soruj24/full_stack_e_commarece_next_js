import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RelatedProductsHeaderProps {
  title: string;
  count: number;
  onScroll: (direction: "left" | "right") => void;
}

export function RelatedProductsHeader({ title, count, onScroll }: RelatedProductsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-xs text-zinc-500">{count} products</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => onScroll("left")} className="rounded-full h-10 w-10">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onScroll("right")} className="rounded-full h-10 w-10">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
