"use client";

import { ProductFormData } from "./types";

interface ProductSettingsProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
}

export function ProductSettings({
  formData,
  setFormData,
}: ProductSettingsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex items-center gap-4 p-6 bg-muted/30 rounded-3xl border border-border/50">
        <div className="flex-1">
          <h4 className="font-bold">Put on Sale</h4>
          <p className="text-sm text-muted-foreground">
            Enable discounted price.
          </p>
        </div>
        <input
          type="checkbox"
          checked={formData.onSale}
          onChange={(e) =>
            setFormData({ ...formData, onSale: e.target.checked })
          }
          className="w-6 h-6 rounded-lg accent-primary"
        />
      </div>

      <div className="flex items-center gap-4 p-6 bg-muted/30 rounded-3xl border border-border/50">
        <div className="flex-1">
          <h4 className="font-bold">Featured</h4>
          <p className="text-sm text-muted-foreground">Show on home page.</p>
        </div>
        <input
          type="checkbox"
          checked={formData.isFeatured}
          onChange={(e) =>
            setFormData({ ...formData, isFeatured: e.target.checked })
          }
          className="w-6 h-6 rounded-lg accent-primary"
        />
      </div>

      <div className="flex items-center gap-4 p-6 bg-muted/30 rounded-3xl border border-border/50">
        <div className="flex-1">
          <h4 className="font-bold">Archived</h4>
          <p className="text-sm text-muted-foreground">Hide from store.</p>
        </div>
        <input
          type="checkbox"
          checked={formData.isArchived}
          onChange={(e) =>
            setFormData({ ...formData, isArchived: e.target.checked })
          }
          className="w-6 h-6 rounded-lg accent-primary"
        />
      </div>
    </div>
  );
}
