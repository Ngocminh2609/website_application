import React from "react";
import type { Product } from "../../../types/product";

export const fallbackImage =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800";

export const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (target.dataset.errored === "true") return;
  target.dataset.errored = "true";
  target.src = fallbackImage;
};

// Hàm giải mã thông số kỹ thuật (hỗ trợ cả JSON và chuỗi định dạng Key: Value; Key2: Value)
export const parseSpecs = (
  specsStr: string | null | undefined,
): Record<string, string> => {
  if (!specsStr) return {};
  try {
    return JSON.parse(specsStr);
  } catch {
    const specs: Record<string, string> = {};
    specsStr.split(";").forEach((part) => {
      const [key, ...valueParts] = part.split(":");
      if (key) {
        specs[key.trim()] = valueParts.join(":").trim();
      }
    });
    return specs;
  }
};

// Danh sách ảnh phụ cho chi tiết sản phẩm
export const getProductAllImages = (imageUrl: string, moreImages: string | null | undefined): string[] => {
  const otherImages = moreImages
    ? moreImages.split(",").filter((img) => img.trim() !== "")
    : [];
  return [imageUrl, ...otherImages];
};

// Xử lý thông số kỹ thuật dạng danh sách cho chi tiết sản phẩm
export const getSpecsList = (specifications: string | null | undefined): string[] => {
  return specifications
    ? specifications
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s !== "")
    : [];
};

// Tính toán phần trăm giảm giá
export const getDiscountPercent = (
  discountPercent: number | null | undefined,
  originalPrice: number | null | undefined,
  price: number
): number => {
  return (
    discountPercent ||
    (originalPrice && price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0)
  );
};

// Lấy danh sách thương hiệu duy nhất
export const getUniqueBrands = (products: { brand?: string | null }[]): string[] => {
  const uniqueBrands = new Set(
    products.map((p) => p.brand).filter(Boolean) as string[],
  );
  return Array.from(uniqueBrands);
};

// Lọc sản phẩm
export const filterProducts = (
  products: Product[],
  selectedBrands: string[],
  selectedCategories: number[],
  priceRange: [number, number]
) => {
  return products.filter((p) => {
    const matchBrand =
      selectedBrands.length === 0 ||
      (p.brand && selectedBrands.includes(p.brand));
    const matchCategory =
      selectedCategories.length === 0 ||
      (p.category && selectedCategories.includes(p.category.id));
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchBrand && matchCategory && matchPrice;
  });
};
