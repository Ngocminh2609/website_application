import { useState, useEffect, useRef } from "react";
import { useProducts } from "./useProducts";
import { trackingUtils } from "../../utils/tracking";
import type { Product } from "../../types/product";

let activeFetchPromise: Promise<Product[]> | null = null;

/**
 * Hook cung cấp danh sách sản phẩm được cá nhân hóa cho người dùng.
 */
export const usePersonalizedProducts = (limit: number = 6) => {
  const { products, bestSellers, loading, fetchProducts, initializeHomeData } =
    useProducts();
  const [personalized, setPersonalized] = useState<Product[]>([]);
  const [isFetchingServer, setIsFetchingServer] = useState(false);

  const hasAttempted = useRef(false);
  const hasFetchedServer = useRef(false);

  useEffect(() => {
    if (products.length === 0 && !loading && !hasAttempted.current) {
      hasAttempted.current = true;
      fetchProducts();
      initializeHomeData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length, loading]);

  useEffect(() => {
    const fetchPersonalized = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        if (hasFetchedServer.current) return;
        try {
          setIsFetchingServer(true);
          hasFetchedServer.current = true;
          const { recommendationApi } =
            await import("../../api/recommendationApi");

          if (!activeFetchPromise) {
            activeFetchPromise = recommendationApi.getPersonalized(limit);
          }

          const serverData = await activeFetchPromise;

          if (serverData && serverData.length > 0) {
            setPersonalized(serverData);
            setIsFetchingServer(false);
            return;
          }
        } catch (e) {
          console.error("Lỗi khi lấy gợi ý từ server:", e);
        } finally {
          setTimeout(() => {
            activeFetchPromise = null;
          }, 2000);
          setIsFetchingServer(false);
        }
      }

      if (loading || (products.length === 0 && bestSellers.length === 0))
        return;
      const recentlyViewedIds = trackingUtils.getRecentlyViewedIds();
      const topCategoryNames = trackingUtils.getTopInterests();

      const recentlyViewed = products
        .filter((p) => recentlyViewedIds.includes(p.id))
        .sort(
          (a, b) =>
            recentlyViewedIds.indexOf(a.id) - recentlyViewedIds.indexOf(b.id),
        );

      const relevantToInterests = products.filter(
        (p) =>
          topCategoryNames.includes(p.category?.name || "") &&
          !recentlyViewedIds.includes(p.id),
      );

      const fallback = bestSellers.filter(
        (p) =>
          !recentlyViewedIds.includes(p.id) &&
          !relevantToInterests.map((i) => i.id).includes(p.id),
      );

      const combined = [
        ...recentlyViewed.slice(0, Math.ceil(limit * 0.4)),
        ...relevantToInterests.slice(0, Math.ceil(limit * 0.4)),
        ...fallback,
      ].slice(0, limit);

      setPersonalized(combined);
    };

    fetchPersonalized();
  }, [products, bestSellers, loading, limit]);

  return {
    personalized,
    loading: loading || isFetchingServer,
  };
};
