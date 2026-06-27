"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Ruler, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SizeGuide } from "./SizeGuide";

interface ColorOption {
  name: string;
  value: string;
  hex?: string;
  image?: string;
}

interface SizeOption {
  name: string;
  value: string;
  stock?: number;
  available?: boolean;
}

interface ProductVariantSelectorProps {
  colors?: ColorOption[];
  sizes?: SizeOption[];
  selectedColor?: string;
  selectedSize?: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  productName?: string;
  category?: string;
}

export function ProductVariantSelector({
  colors = [],
  sizes = [],
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  productName,
  category,
}: ProductVariantSelectorProps) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showSizeAlert, setShowSizeAlert] = useState(false);

  const defaultColors: ColorOption[] = [
    { name: "Black", value: "black", hex: "#000000" },
    { name: "White", value: "white", hex: "#FFFFFF" },
    { name: "Navy", value: "navy", hex: "#1E3A5F" },
    { name: "Red", value: "red", hex: "#DC2626" },
    { name: "Green", value: "green", hex: "#16A34A" },
    { name: "Blue", value: "blue", hex: "#2563EB" },
  ];

  const defaultSizes: SizeOption[] = [
    { name: "XS", value: "XS" },
    { name: "S", value: "S" },
    { name: "M", value: "M" },
    { name: "L", value: "L" },
    { name: "XL", value: "XL" },
    { name: "2XL", value: "2XL" },
  ];

  const displayColors = colors.length > 0 ? colors : defaultColors;
  const displaySizes = sizes.length > 0 ? sizes : defaultSizes;

  const handleSizeClick = (size: SizeOption) => {
    if (size.available === false) {
      setShowSizeAlert(true);
      setTimeout(() => setShowSizeAlert(false), 3000);
      return;
    }
    onSizeChange(size.value);
  };

  return (
    <div className="space-y-6">
      {/* Color Selector */}
      {displayColors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold">
              Color
              {selectedColor && (
                <span className="text-zinc-500 font-normal ml-1">
                  — {displayColors.find((c) => c.value === selectedColor)?.name}
                </span>
              )}
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {displayColors.map((color) => {
              const isSelected = selectedColor === color.value;
              return (
                <motion.button
                  key={color.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onColorChange(color.value)}
                  className={`relative w-11 h-11 rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-background"
                      : "border-zinc-200 dark:border-white/20 hover:border-zinc-400 dark:hover:border-white/40"
                  }`}
                  style={{
                    backgroundColor: color.hex || color.value,
                  }}
                  title={color.name}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check
                        className={`w-5 h-5 ${
                          color.value === "white" || color.value === "yellow" || color.value === "cream"
                            ? "text-black"
                            : "text-white"
                        }`}
                      />
                    </motion.div>
                  )}
                  {color.image && (
                    <img
                      src={color.image}
                      alt={color.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {displaySizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold">
              Size
              {selectedSize && (
                <span className="text-zinc-500 font-normal ml-1">
                  — {selectedSize}
                </span>
              )}
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSizeGuide(true)}
              className="h-8 text-xs text-zinc-500 hover:text-primary gap-1"
            >
              <Ruler className="w-3.5 h-3.5" />
              Size Guide
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {displaySizes.map((size) => {
              const isSelected = selectedSize === size.value;
              const isAvailable = size.available !== false;
              const lowStock = size.stock && size.stock < 5 && size.stock > 0;

              return (
                <motion.button
                  key={size.value}
                  whileHover={isAvailable ? { scale: 1.02 } : {}}
                  whileTap={isAvailable ? { scale: 0.98 } : {}}
                  onClick={() => handleSizeClick(size)}
                  disabled={!isAvailable}
                  className={`relative min-w-[56px] h-11 px-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : isAvailable
                      ? "border-zinc-200 dark:border-white/20 hover:border-primary bg-white dark:bg-zinc-900 hover:bg-primary/5"
                      : "border-zinc-100 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed line-through"
                  }`}
                >
                  {size.value}
                  {lowStock && isAvailable && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Size Alert */}
          {showSizeAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl flex items-center gap-2 text-sm text-orange-700 dark:text-orange-400"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>This size is currently out of stock. Please select another size.</span>
            </motion.div>
          )}

          {/* Size Guide Link */}
          {!selectedSize && sizes.length > 0 && (
            <p className="mt-2 text-xs text-zinc-500">
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-primary hover:underline"
              >
                Need help finding your size?
              </button>
            </p>
          )}
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuide
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={category}
        productName={productName}
      />
    </div>
  );
}
