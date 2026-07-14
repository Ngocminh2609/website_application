import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useProducts } from "./useProducts";

export const useProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { products, categories, fetchProducts, initializeHomeData } =
    useProducts();

  const [loading, setLoading] = useState<boolean>(true);

  // Trạng thái bộ lọc - Khởi tạo từ URL nếu có
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll("brand"),
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    searchParams.getAll("category").map((id) => parseInt(id)),
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000,
  ]);

  useEffect(() => {
    // Cập nhật URL khi bộ lọc thay đổi
    const params = new URLSearchParams();
    selectedBrands.forEach((brand) => params.append("brand", brand));
    selectedCategories.forEach((catId) =>
      params.append("category", catId.toString()),
    );

    // Chỉ cập nhật nếu searchParams hiện tại khác với params mới để tránh loop
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, selectedBrands, selectedCategories, setSearchParams]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Sử dụng Context để fetch dữ liệu, đảm bảo không gọi trùng lặp (Single Flight)
        await Promise.all([
          fetchProducts(),
          initializeHomeData(), // Lấy categories
        ]);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [fetchProducts, initializeHomeData, location.key]);

  return {
    products,
    categories,
    loading,
    selectedBrands,
    setSelectedBrands,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
  };
};
