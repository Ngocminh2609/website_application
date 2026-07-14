import { createContext } from "react";
import type { Product } from "../types/product";

export interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  isComparing: (productId: number) => boolean;
}

export const CompareContext = createContext<CompareContextType | undefined>(
  undefined,
);
