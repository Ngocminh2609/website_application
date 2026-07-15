import { useState, type Dispatch, type SetStateAction } from "react";

const DEFAULT_PRICE_RANGE: [number, number] = [0, 100000000];

export interface ProductFiltersState {
  selectedBrands: string[];
  setSelectedBrands: Dispatch<SetStateAction<string[]>>;
  selectedCategories: number[];
  setSelectedCategories: Dispatch<SetStateAction<number[]>>;
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
}

/**
 * State bộ lọc sản phẩm dùng chung cho ProductsPage và SearchPage.
 */
export const useProductFilters = (
  initialBrands: string[] = [],
  initialCategories: number[] = [],
  initialPriceRange: [number, number] = DEFAULT_PRICE_RANGE,
): ProductFiltersState => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrands);
  const [selectedCategories, setSelectedCategories] =
    useState<number[]>(initialCategories);
  const [priceRange, setPriceRange] =
    useState<[number, number]>(initialPriceRange);

  return {
    selectedBrands,
    setSelectedBrands,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
  };
};
