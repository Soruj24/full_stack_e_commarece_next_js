import { useState } from "react";
import type { SubTabKey, CategoryTabKey } from "@/modules/products/types/size-guide";

export function useSizeGuide() {
  const [selectedTab, setSelectedTab] = useState<CategoryTabKey>("clothing");
  const [selectedSubTab, setSelectedSubTab] = useState<SubTabKey>("tops");

  return { selectedTab, setSelectedTab, selectedSubTab, setSelectedSubTab };
}
