"use client";

interface CartHeaderProps {
  totalItems: number;
}

export function CartHeader({ totalItems }: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-8">
      <h1 className="text-5xl font-black tracking-tighter">
        Shopping <span className="text-primary">Cart</span>
      </h1>
      <span className="text-xs font-black uppercase tracking-widest bg-primary/10 text-primary px-4 py-1.5 rounded-full">
        {totalItems} {totalItems === 1 ? "Item" : "Items"}
      </span>
    </div>
  );
}