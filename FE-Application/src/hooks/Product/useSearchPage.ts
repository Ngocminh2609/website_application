import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { useProducts } from "./useProducts";
import type { Product } from "../../types/product";
import { useProductFilters } from "./useProductFilters";

export const useSearchPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get("q") || "";

  const { categories, initializeHomeData } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    selectedBrands,
    setSelectedBrands,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
  } = useProductFilters();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const isNumeric = /^\d+$/.test(query);
        let searchData: Product[] = [];

        if (isNumeric) {
          try {
            const productById = await productApi.getProductById(
              parseInt(query),
            );
            if (productById) searchData = [productById];
          } catch {
            // Nếu không tìm thấy theo ID thì bỏ qua để tìm theo tên
          }
        }

        const resultsByName = await productApi.searchProducts(query);

        const combined = [...searchData];
        resultsByName.forEach((p) => {
          if (!combined.some((cp) => cp.id === p.id)) {
            combined.push(p);
          }
        });

        setProducts(combined);
        await initializeHomeData();
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, initializeHomeData, location.key]);

  return {
    query,
    categories,
    products,
    loading,
    selectedBrands,
    setSelectedBrands,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
  };
};
