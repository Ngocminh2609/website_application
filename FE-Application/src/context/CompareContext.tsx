import React, { useState, useEffect } from "react";
import type { Product } from "../types/product";
import { notification } from "../utils/notification";
import { CompareContext } from "./CompareContextModel";

const MAX_COMPARE_ITEMS = 4;

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [compareItems, setCompareItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem("compare_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse compare products", e);
      }
    }
    return [];
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("compare_products", JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product: Product) => {
    if (compareItems.find((item) => item.id === product.id)) {
      notification.info("Sản phẩm đã có trong danh sách so sánh");
      return;
    }

    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      notification.warning(
        `Chỉ có thể so sánh tối đa ${MAX_COMPARE_ITEMS} sản phẩm`,
      );
      return;
    }

    setCompareItems((prev) => [...prev, product]);
    notification.success("Đã thêm vào danh sách so sánh");
  };

  const removeFromCompare = (productId: number) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isComparing = (productId: number) => {
    return !!compareItems.find((item) => item.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
