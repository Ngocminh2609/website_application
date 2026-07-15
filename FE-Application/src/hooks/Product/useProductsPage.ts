import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useProducts } from "./useProducts";
import { useProductFilters } from "./useProductFilters";

export const useProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { products, categories, fetchProducts, initializeHomeData } =
    useProducts();

  const [loading, setLoading] = useState<boolean>(true);

  const filters = useProductFilters(
    searchParams.getAll("brand"),
    searchParams.getAll("category").map((id) => parseInt(id)),
  );

  const {
    selectedBrands,
    setSelectedBrands,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
  } = filters;

  useEffect(() => {
    const params = new URLSearchParams();
    selectedBrands.forEach((brand) => params.append("brand", brand));
    selectedCategories.forEach((catId) =>
      params.append("category", catId.toString()),
    );

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, selectedBrands, selectedCategories, setSearchParams]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProducts(), initializeHomeData()]);
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
