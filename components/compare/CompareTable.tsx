"use client";

import Image from "next/image";
import { X, CheckCircle2, AlertCircle, Star } from "lucide-react";
import { getSafeImageSrc, getFallbackImage, cn } from "@/lib/utils";
import { useLocalization } from "@/context/LocalizationContext";
import { formatPrice, convertPrice } from "@/lib/localization";

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  brand?: string;
  stock?: number;
  rating?: number;
  numReviews?: number;
  weight?: string;
  dimensions?: string;
  material?: string;
  warranty?: string;
  description?: string;
}

interface CompareTableProps {
  products: Product[];
}

const SPECS = [
  { key: "price", label: "Price" },
  { key: "brand", label: "Brand" },
  { key: "stock", label: "Availability" },
  { key: "rating", label: "Rating" },
  { key: "numReviews", label: "Reviews" },
  { key: "weight", label: "Weight" },
  { key: "dimensions", label: "Dimensions" },
  { key: "material", label: "Material" },
  { key: "warranty", label: "Warranty" },
  { key: "description", label: "Description" },
];

export function CompareTable({ products }: CompareTableProps) {
  const { currency } = useLocalization();

  if (products.length < 2) return null;

  const getSpecValue = (product: Product, key: string) => {
    switch (key) {
      case "price":
        return formatPrice(convertPrice(product.price, currency), currency);
      case "brand":
        return product.brand || "N/A";
      case "stock":
        if (!product.stock) return "N/A";
        if (product.stock === 0) return (
          <span className="inline-flex items-center gap-1 text-red-500">
            <X className="w-4 h-4" /> Out of Stock
          </span>
        );
        if (product.stock <= 5) return (
          <span className="inline-flex items-center gap-1 text-orange-500">
            <AlertCircle className="w-4 h-4" /> Only {product.stock} left
          </span>
        );
        return (
          <span className="inline-flex items-center gap-1 text-green-500">
            <CheckCircle2 className="w-4 h-4" /> In Stock
          </span>
        );
      case "rating":
        return product.rating ? (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{product.rating}/5</span>
          </div>
        ) : "N/A";
      case "numReviews":
        return product.numReviews ? `${product.numReviews} reviews` : "N/A";
      case "weight":
        return product.weight || "N/A";
      case "dimensions":
        return product.dimensions || "N/A";
      case "material":
        return product.material || "N/A";
      case "warranty":
        return product.warranty || "N/A";
      case "description":
        return product.description ? (
          <span className="line-clamp-3">{product.description}</span>
        ) : "N/A";
      default:
        return "N/A";
    }
  };

  return (
    <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Detailed Comparison</h2>
        <p className="text-sm text-muted-foreground">
          Compare specifications and features side by side
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-4 text-left font-semibold w-48 sticky left-0 bg-muted/50">
                Specification
              </th>
              {products.map((product) => (
                <th key={product._id} className="p-4 text-center font-semibold min-w-[200px]">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden mx-auto mb-2 bg-background">
                    <Image
                      src={getSafeImageSrc(product.images?.[0])}
                      alt={product.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getFallbackImage();
                      }}
                    />
                  </div>
                  <span className="text-sm">{product.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPECS.map((spec, index) => {
              const values = products.map((p) => getSpecValue(p, spec.key));
              const allSame = values.every((v) => {
                if (typeof v === "object") return false;
                return v === values[0];
              });

              return (
                <tr
                  key={spec.key}
                  className={cn(
                    "border-t border-border/50",
                    index % 2 === 0 && "bg-muted/20"
                  )}
                >
                  <td className="p-4 font-medium sticky left-0 bg-inherit">
                    {spec.label}
                  </td>
                  {values.map((value, i) => (
                    <td
                      key={i}
                      className={cn(
                        "p-4 text-center",
                        !allSame && "font-medium"
                      )}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}