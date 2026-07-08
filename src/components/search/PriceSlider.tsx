"use client";

import { useState, useEffect, useCallback } from "react";
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

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleSlider = useCallback((v: number[]) => {
    const val: [number, number] = [v[0], v[1]];
    setLocal(val);
  }, []);

  const handleCommit = useCallback((v: number[]) => {
    const val: [number, number] = [v[0], v[1]];
    setLocal(val);
    onChange(val);
  }, [onChange]);

  const handleMinInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(min, Math.min(Number(e.target.value) || min, local[1]));
    setLocal([v, local[1]]);
  }, [min, local]);

  const handleMaxInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(max, Math.max(Number(e.target.value) || max, local[0]));
    setLocal([local[0], v]);
  }, [max, local]);

  const handleBlur = useCallback(() => {
    onChange(local);
  }, [local, onChange]);

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Price Range</label>
      <Slider
        value={local}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSlider}
        onValueCommit={handleCommit}
        className="mt-2"
      />
      <div className="flex items-center gap-2 mt-3">
        <Input
          type="number"
          value={local[0]}
          onChange={handleMinInput}
          onBlur={handleBlur}
          min={min}
          max={local[1]}
          step={step}
          className="h-9 text-sm"
        />
        <span className="text-muted-foreground text-xs">—</span>
        <Input
          type="number"
          value={local[1]}
          onChange={handleMaxInput}
          onBlur={handleBlur}
          min={local[0]}
          max={max}
          step={step}
          className="h-9 text-sm"
        />
      </div>
    </div>
  );
}
