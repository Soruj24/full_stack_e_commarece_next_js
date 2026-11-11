"use client"

import * as React from "react"
import { ProductGallery } from "./ProductGallery"

type ProductGalleryProps = React.ComponentProps<typeof ProductGallery>

export function ProductImageGallery(props: ProductGalleryProps) {
  return <ProductGallery {...props} />
}

export { ProductGallery }
