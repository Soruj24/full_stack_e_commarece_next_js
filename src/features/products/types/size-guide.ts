export interface SizeGuideRow {
  [key: string]: string;
}

export interface SizeGuideTable {
  name: string;
  headers: string[];
  rows: SizeGuideRow[];
}

export interface SizeGuideCollection {
  clothing: {
    tops: SizeGuideTable;
    bottoms: SizeGuideTable;
    dresses: SizeGuideTable;
  };
  footwear: {
    mens: SizeGuideTable;
    womens: SizeGuideTable;
  };
  accessories: {
    belts: SizeGuideTable;
    hats: SizeGuideTable;
  };
}

export type SubTabKey = "tops" | "bottoms" | "dresses" | "mens" | "womens" | "belts" | "hats";
export type CategoryTabKey = "clothing" | "footwear" | "accessories";
