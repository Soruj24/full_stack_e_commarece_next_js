import type { SizeGuideCollection } from "@/features/products/types/size-guide";

export const SIZE_GUIDES: SizeGuideCollection = {
  clothing: {
    tops: {
      name: "Tops & Shirts",
      headers: ["Size", "Chest (in)", "Waist (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        { size: "XS", chest: "32-34", waist: "26-28", length: "26", shoulder: "16" },
        { size: "S", chest: "35-37", waist: "28-30", length: "27", shoulder: "17" },
        { size: "M", chest: "38-40", waist: "30-32", length: "28", shoulder: "18" },
        { size: "L", chest: "41-43", waist: "32-34", length: "29", shoulder: "19" },
        { size: "XL", chest: "44-46", waist: "34-36", length: "30", shoulder: "20" },
        { size: "2XL", chest: "47-49", waist: "36-38", length: "31", shoulder: "21" },
      ],
    },
    bottoms: {
      name: "Pants & Shorts",
      headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)"],
      rows: [
        { size: "XS", waist: "26-28", hip: "32-34", inseam: "30" },
        { size: "S", waist: "28-30", hip: "34-36", inseam: "30" },
        { size: "M", waist: "30-32", hip: "36-38", inseam: "32" },
        { size: "L", waist: "32-34", hip: "38-40", inseam: "32" },
        { size: "XL", waist: "34-36", hip: "40-42", inseam: "34" },
        { size: "2XL", waist: "36-38", hip: "42-44", inseam: "34" },
      ],
    },
    dresses: {
      name: "Dresses",
      headers: ["Size", "Bust (in)", "Waist (in)", "Hip (in)", "Length (in)"],
      rows: [
        { size: "XS", bust: "32-34", waist: "24-26", hip: "34-36", length: "36" },
        { size: "S", bust: "34-36", waist: "26-28", hip: "36-38", length: "37" },
        { size: "M", bust: "36-38", waist: "28-30", hip: "38-40", length: "38" },
        { size: "L", bust: "38-40", waist: "30-32", hip: "40-42", length: "39" },
        { size: "XL", bust: "40-42", waist: "32-34", hip: "42-44", length: "40" },
        { size: "2XL", bust: "42-44", waist: "34-36", hip: "44-46", length: "41" },
      ],
    },
  },
  footwear: {
    mens: {
      name: "Men's Shoes",
      headers: ["US", "EU", "UK", "Length (cm)"],
      rows: [
        { size: "6", eu: "39", uk: "5.5", length: "24" },
        { size: "7", eu: "40", uk: "6.5", length: "25" },
        { size: "8", eu: "41", uk: "7.5", length: "26" },
        { size: "9", eu: "42", uk: "8.5", length: "27" },
        { size: "10", eu: "43", uk: "9.5", length: "28" },
        { size: "11", eu: "44", uk: "10.5", length: "29" },
        { size: "12", eu: "45", uk: "11.5", length: "30" },
      ],
    },
    womens: {
      name: "Women's Shoes",
      headers: ["US", "EU", "UK", "Length (cm)"],
      rows: [
        { size: "5", eu: "35", uk: "3", length: "22" },
        { size: "6", eu: "36", uk: "4", length: "23" },
        { size: "7", eu: "37", uk: "5", length: "24" },
        { size: "8", eu: "38", uk: "6", length: "25" },
        { size: "9", eu: "39", uk: "7", length: "26" },
        { size: "10", eu: "40", uk: "8", length: "27" },
        { size: "11", eu: "41", uk: "9", length: "28" },
      ],
    },
  },
  accessories: {
    belts: {
      name: "Belts",
      headers: ["Size", "Waist (in)", "Length (in)"],
      rows: [
        { size: "XS", waist: "26-28", length: "28" },
        { size: "S", waist: "28-30", length: "30" },
        { size: "M", waist: "30-32", length: "32" },
        { size: "L", waist: "32-34", length: "34" },
        { size: "XL", waist: "34-36", length: "36" },
        { size: "2XL", waist: "36-38", length: "38" },
      ],
    },
    hats: {
      name: "Hats",
      headers: ["Size", "Head Circumference (in)"],
      rows: [
        { size: "S/M", head: "21-22" },
        { size: "M/L", head: "22-23" },
        { size: "L/XL", head: "23-24" },
      ],
    },
  },
};
