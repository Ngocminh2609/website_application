import type { Category } from "./category";

/**
 * Định nghĩa cấu trúc dữ liệu cho thực thể Sản phẩm.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  moreImages?: string;
  brand?: string;
  isBestSeller?: boolean;
  originalPrice?: number;
  discountPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  specifications?: string;
  isActive?: boolean;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Giao diện cho yêu cầu tạo/cập nhật sản phẩm.
 */
export interface ProductRequest {
  name: string;
  description: string;
  originalPrice: number;
  discountPercent: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  brand?: string;
  isBestSeller?: boolean;
  specifications?: string;
  moreImages?: string;
  isActive?: boolean;
}
