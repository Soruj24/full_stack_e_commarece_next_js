"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler } from "lucide-react";
import { SIZE_GUIDES } from "@/lib/data/size-guides";
import { useSizeGuide } from "@/features/products/hooks/use-size-guide";
import { SizeTable } from "./size-guide/SizeTable";
import { HowToMeasure } from "./size-guide/HowToMeasure";
import { FitTips } from "./size-guide/FitTips";
import type { SubTabKey, SizeGuideTable } from "@/features/products/types/size-guide";

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  productName?: string;
}

const CATEGORY_MAP: Record<string, () => SizeGuideTable> = {
  tops: () => SIZE_GUIDES.clothing.tops,
  bottoms: () => SIZE_GUIDES.clothing.bottoms,
  dresses: () => SIZE_GUIDES.clothing.dresses,
  mens: () => SIZE_GUIDES.footwear.mens,
  womens: () => SIZE_GUIDES.footwear.womens,
  belts: () => SIZE_GUIDES.accessories.belts,
  hats: () => SIZE_GUIDES.accessories.hats,
};

const TABS: { key: string; label: string; subTabs: { key: SubTabKey; label: string }[] }[] = [
  {
    key: "clothing",
    label: "Clothing",
    subTabs: [
      { key: "tops", label: "Tops & Shirts" },
      { key: "bottoms", label: "Pants & Shorts" },
      { key: "dresses", label: "Dresses" },
    ],
  },
  {
    key: "footwear",
    label: "Footwear",
    subTabs: [
      { key: "mens", label: "Men's Shoes" },
      { key: "womens", label: "Women's Shoes" },
    ],
  },
  {
    key: "accessories",
    label: "Accessories",
    subTabs: [
      { key: "belts", label: "Belts" },
      { key: "hats", label: "Hats" },
    ],
  },
];

export function SizeGuide({ isOpen, onClose, productName }: SizeGuideProps) {
  const { selectedTab, setSelectedTab, selectedSubTab, setSelectedSubTab } = useSizeGuide();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0 rounded-3xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Ruler className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Size Guide</DialogTitle>
              <DialogDescription className="text-sm text-zinc-500">
                {productName ? `Find your perfect fit for ${productName}` : "Find your perfect fit"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as typeof selectedTab)}>
            <TabsList className="w-full mb-6 bg-zinc-100 dark:bg-white/10 p-1 rounded-xl">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map((tab) => (
              <TabsContent key={tab.key} value={tab.key} className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {tab.subTabs.map((sub) => (
                    <Button
                      key={sub.key}
                      variant={selectedSubTab === sub.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubTab(sub.key)}
                      className="rounded-full"
                    >
                      {sub.label}
                    </Button>
                  ))}
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                  <SizeTable guide={CATEGORY_MAP[selectedSubTab]?.() ?? null} />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <HowToMeasure />
          <FitTips />
        </div>
      </DialogContent>
    </Dialog>
  );
}
