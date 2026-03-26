"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, Check, X } from "lucide-react";

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  productName?: string;
}

const SIZE_GUIDES = {
  clothing: {
    tops: {
      name: "Tops & Shirts",
      headers: ["Size", "Chest (in)", "Waist (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        { size: "XS", chest: "32-34", waist: "26-28", length: "26", shoulder: "16" },
        { size: "S", chest: "35-37", waist: "28-30", length: "27", shoulder: "17" },
        { size: "M", chest: "38-40", waist: "30-32", length: "28", shoulder: "18" },
        { size: "L", chest: "41-43", waist: "32-34", length: "29", shoulder: "19" },
        { size: "XL", chest: "44-46", waist: "34-36", length: "30", shoulder: "20" },
        { size: "2XL", chest: "47-49", waist: "36-38", length: "31", shoulder: "21" },
      ],
    },
    bottoms: {
      name: "Pants & Shorts",
      headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        { size: "XS", waist: "26-28", hip: "32-34", inseam: "30" },
        { size: "S", waist: "28-30", hip: "34-36", inseam: "30" },
        { size: "M", waist: "30-32", hip: "36-38", inseam: "32" },
        { size: "L", waist: "32-34", hip: "38-40", inseam: "32" },
        { size: "XL", waist: "34-36", hip: "40-42", inseam: "34" },
        { size: "2XL", waist: "36-38", hip: "42-44", inseam: "34" },
      ],
    },
    dresses: {
      name: "Dresses",
      headers: ["Size", "Bust (in)", "Waist (in)", "Hip (in)", "Length (in)"],
      rows: [
        { size: "XS", bust: "32-34", waist: "24-26", hip: "34-36", length: "36" },
        { size: "S", bust: "34-36", waist: "26-28", hip: "36-38", length: "37" },
        { size: "M", bust: "36-38", waist: "28-30", hip: "38-40", length: "38" },
        { size: "L", bust: "38-40", waist: "30-32", hip: "40-42", length: "39" },
        { size: "XL", bust: "40-42", waist: "32-34", hip: "42-44", length: "40" },
        { size: "2XL", bust: "42-44", waist: "34-36", hip: "44-46", length: "41" },
      ],
    },
  },
  footwear: {
    mens: {
      name: "Men's Shoes",
      headers: ["US", "EU", "UK", "Length (cm)"],
      rows: [
        { size: "6", eu: "39", uk: "5.5", length: "24" },
        { size: "7", eu: "40", uk: "6.5", length: "25" },
        { size: "8", eu: "41", uk: "7.5", length: "26" },
        { size: "9", eu: "42", uk: "8.5", length: "27" },
        { size: "10", eu: "43", uk: "9.5", length: "28" },
        { size: "11", eu: "44", uk: "10.5", length: "29" },
        { size: "12", eu: "45", uk: "11.5", length: "30" },
      ],
    },
    womens: {
      name: "Women's Shoes",
      headers: ["US", "EU", "UK", "Length (cm)"],
      rows: [
        { size: "5", eu: "35", uk: "3", length: "22" },
        { size: "6", eu: "36", uk: "4", length: "23" },
        { size: "7", eu: "37", uk: "5", length: "24" },
        { size: "8", eu: "38", uk: "6", length: "25" },
        { size: "9", eu: "39", uk: "7", length: "26" },
        { size: "10", eu: "40", uk: "8", length: "27" },
        { size: "11", eu: "41", uk: "9", length: "28" },
      ],
    },
  },
  accessories: {
    belts: {
      name: "Belts",
      headers: ["Size", "Waist (in)", "Length (in)"],
      rows: [
        { size: "XS", waist: "26-28", length: "28" },
        { size: "S", waist: "28-30", length: "30" },
        { size: "M", waist: "30-32", length: "32" },
        { size: "L", waist: "32-34", length: "34" },
        { size: "XL", waist: "34-36", length: "36" },
        { size: "2XL", waist: "36-38", length: "38" },
      ],
    },
    hats: {
      name: "Hats",
      headers: ["Size", "Head Circumference (in)"],
      rows: [
        { size: "S/M", head: "21-22" },
        { size: "M/L", head: "22-23" },
        { size: "L/XL", head: "23-24" },
      ],
    },
  },
};

export function SizeGuide({ isOpen, onClose, category, productName }: SizeGuideProps) {
  const [selectedTab, setSelectedTab] = useState("clothing");
  const [selectedSubTab, setSelectedSubTab] = useState("tops");

  const renderTable = (guide: any) => {
    if (!guide) return null;
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-white/10">
              {guide.headers.map((header: string, i: number) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-zinc-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guide.rows.map((row: any, i: number) => (
              <tr
                key={i}
                className="border-b border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
              >
                {Object.values(row).map((value: any, j: number) => (
                  <td key={j} className="px-4 py-3 text-sm font-medium">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getCurrentGuide = () => {
    const categoryMap: Record<string, any> = {
      tops: SIZE_GUIDES.clothing.tops,
      bottoms: SIZE_GUIDES.clothing.bottoms,
      dresses: SIZE_GUIDES.clothing.dresses,
      mens: SIZE_GUIDES.footwear.mens,
      womens: SIZE_GUIDES.footwear.womens,
      belts: SIZE_GUIDES.accessories.belts,
      hats: SIZE_GUIDES.accessories.hats,
    };
    return categoryMap[selectedSubTab] || SIZE_GUIDES.clothing.tops;
  };

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
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full mb-6 bg-zinc-100 dark:bg-white/10 p-1 rounded-xl">
              <TabsTrigger
                value="clothing"
                className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm"
              >
                Clothing
              </TabsTrigger>
              <TabsTrigger
                value="footwear"
                className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm"
              >
                Footwear
              </TabsTrigger>
              <TabsTrigger
                value="accessories"
                className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm"
              >
                Accessories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clothing" className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedSubTab === "tops" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubTab("tops")}
                  className="rounded-full"
                >
                  Tops & Shirts
                </Button>
                <Button
                  variant={selectedSubTab === "bottoms" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubTab("bottoms")}
                  className="rounded-full"
                >
                  Pants & Shorts
                </Button>
                <Button
                  variant={selectedSubTab === "dresses" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubTab("dresses")}
                  className="rounded-full"
                >
                  Dresses
                </Button>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                {renderTable(getCurrentGuide())}
              </div>
            </TabsContent>

            <TabsContent value="footwear" className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedSubTab === "mens" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubTab("mens")}
                  className="rounded-full"
                >
                  Men's Shoes
                </Button>
                <Button
                  variant={selectedSubTab === "womens" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubTab("womens")}
                  className="rounded-full"
                >
                  Women's Shoes
                </Button>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                {renderTable(getCurrentGuide())}
              </div>
            </TabsContent>

            <TabsContent value="accessories" className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedSubTab === "belts" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubTab("belts")}
                  className="rounded-full"
                >
                  Belts
                </Button>
                <Button
                  variant={selectedSubTab === "hats" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubTab("hats")}
                  className="rounded-full"
                >
                  Hats
                </Button>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                {renderTable(getCurrentGuide())}
              </div>
            </TabsContent>
          </Tabs>

          {/* How to Measure Section */}
          <div className="mt-8 p-5 bg-zinc-50 dark:bg-white/5 rounded-2xl">
            <h4 className="text-sm font-bold mb-4">How to Measure</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Chest/Bust</p>
                  <p className="text-zinc-500 text-xs">
                    Measure around the fullest part of your chest, keeping the tape horizontal.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Waist</p>
                  <p className="text-zinc-500 text-xs">
                    Measure around your natural waistline, keeping the tape comfortably loose.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Hip</p>
                  <p className="text-zinc-500 text-xs">
                    Measure around the fullest part of your hips, about 8" below your waist.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">4</span>
                </div>
                <div>
                  <p className="font-medium">Inseam</p>
                  <p className="text-zinc-500 text-xs">
                    Measure from the crotch seam to the bottom of the leg.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fit Tips */}
          <div className="mt-4 p-5 bg-primary/5 rounded-2xl border border-primary/10">
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              Fit Tips
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                If between sizes, size up for a looser fit or size down for a more fitted look.
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                Consider the fabric composition - stretchy materials may fit differently.
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                Check the product description for specific fit recommendations.
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
