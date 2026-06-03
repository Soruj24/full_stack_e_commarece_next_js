"use client";

interface ShippingOption {
  method: string;
  price: number;
  estimatedDays: string;
}

interface Props {
  description: string;
  tags?: string[];
  shippingOptions?: ShippingOption[];
}

export function ProductDescriptionSection({ description, tags, shippingOptions }: Props) {
  return (
    <div className="mt-24 space-y-12">
      <div className="border-b border-border/50">
        <div className="flex gap-12">
          <button className="pb-6 border-b-4 border-primary text-xl font-black tracking-tight">Product Description</button>
          <button className="pb-6 border-b-4 border-transparent text-xl font-black tracking-tight text-muted-foreground hover:text-foreground transition-colors">Specifications</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-8">
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">{description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tags && tags.length > 0 && (
              <div className="p-8 rounded-3xl bg-card border border-border/50">
                <h4 className="font-black text-lg mb-4">Key Features</h4>
                <ul className="space-y-3">
                  {tags.map((tag, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {shippingOptions && shippingOptions.length > 0 && (
              <div className="p-8 rounded-3xl bg-card border border-border/50">
                <h4 className="font-black text-lg mb-4">Shipping Info</h4>
                <ul className="space-y-4">
                  {shippingOptions.map((opt, i) => (
                    <li key={i} className="flex items-center justify-between font-medium">
                      <span className="text-muted-foreground">{opt.method}</span>
                      <span className="font-black">${opt.price} ({opt.estimatedDays})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
