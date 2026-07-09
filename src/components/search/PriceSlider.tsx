"use client";

import { useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface PriceSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

export function PriceSlider({ min, max, value, onChange, step = 10 }: PriceSliderProps) {
  const [local, setLocal] = useState<[number, number]>(value);

  const handleSlider = useCallback((v: number[]) => {
    setLocal([v[0], v[1]]);
  }, []);

  const handleCommit = useCallback(
    (v: number[]) => {
      const val: [number, number] = [v[0], v[1]];
      setLocal(val);
      onChange(val);
    },
    [onChange]
  );

  const handleMinInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = Number(e.target.value);
      const v = Math.max(min, Math.min(isNaN(raw) ? min : raw, local[1]));
      setLocal([v, local[1]]);
    },
    [min, local]
  );

  const handleMaxInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = Number(e.target.value);
      const v = Math.min(max, Math.max(isNaN(raw) ? max : raw, local[0]));
      setLocal([local[0], v]);
    },
    [max, local]
  );

  const handleBlur = useCallback(() => {
    onChange(local);
  }, [local, onChange]);

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Price Range</label>
      <Slider
        key={`${value[0]}-${value[1]}`}
        defaultValue={value}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSlider}
        onValueCommit={handleCommit}
        className="mt-2"
      />
      <div className="flex items-center gap-2 mt-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">$</span>
          <Input
            type="number"
            value={local[0]}
            onChange={handleMinInput}
            onBlur={handleBlur}
            min={min}
            max={local[1]}
            step={step}
            className="h-9 text-sm pl-7"
            aria-label="Minimum price"
          />
        </div>
        <span className="text-muted-foreground text-xs flex-shrink-0">to</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">$</span>
          <Input
            type="number"
            value={local[1]}
            onChange={handleMaxInput}
            onBlur={handleBlur}
            min={local[0]}
            max={max}
            step={step}
            className="h-9 text-sm pl-7"
            aria-label="Maximum price"
          />
        </div>
      </div>
    </div>
  );
}
