import { FALLBACK_IMAGE } from "../../../styles/commonStyles";
import type { Banner } from "../../../types/banner";
import type { Product } from "../../../types/product";

export const createDefaultProducts = (
  categoryName: string,
  count: number = 4,
): Product[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: -100 - index,
    name: `${categoryName} Default ${index + 1}`,
    description: `Mô tả sản phẩm ${categoryName} ${index + 1} mặc định của cửa hàng Tech Nova. Trải nghiệm hiệu năng cao và thiết kế tinh tế đẳng cấp.`,
    price: 990000 + index * 500000,
    originalPrice: 1290000 + index * 500000,
    stockQuantity: 10,
    imageUrl: FALLBACK_IMAGE,
    brand: categoryName,
    rating: 4.5,
    reviewCount: 12,
    discountPercent: 20,
  }));
};

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: -1,
    title: "Trải Nghiệm Công Nghệ Đỉnh Cao cùng Tech Nova",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=400",
    linkUrl: "/products",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: -2,
    title: "Khám Phá Hệ Sinh Thái Apple Ecosystem",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200&h=400",
    linkUrl: "/products?brand=Apple",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: -3,
    title: "Ưu Đãi Lớn Cho Các Dòng Laptop & SmartPhone",
    imageUrl:
      "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&q=80&w=1200&h=400",
    linkUrl: "/products",
    sortOrder: 3,
    isActive: true,
  },
];

/**
 * Lấy danh sách sản phẩm hiển thị, nếu rỗng thì trả về danh sách mặc định
 */
export const getDisplayProducts = (
  products: Product[],
  categoryName: string,
  count: number = 4,
): Product[] => {
  return products.length > 0 ? products : createDefaultProducts(categoryName, count);
};

/**
 * Định dạng cấu trúc dữ liệu của các thương hiệu chính
 */
export const formatBrandsData = (
  appleProducts: Product[],
  samsungProducts: Product[],
) => {
  return [
    {
      id: "Apple",
      name: "Apple Ecosystem",
      products:
        appleProducts.length > 0
          ? appleProducts.slice(0, 4)
          : createDefaultProducts("Apple"),
    },
    {
      id: "Samsung",
      name: "Samsung Galaxy",
      products:
        samsungProducts.length > 0
          ? samsungProducts.slice(0, 4)
          : createDefaultProducts("Samsung"),
    },
  ];
};

/**
 * Giải quyết danh sách banners hiển thị (sử dụng mặc định nếu rỗng)
 */
export const resolveBanners = (activeBanners: Banner[]): Banner[] => {
  return activeBanners && activeBanners.length > 0 ? activeBanners : DEFAULT_BANNERS;
};
