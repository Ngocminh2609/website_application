import { useState, useEffect } from 'react';
import { useProducts } from './useProducts';
import { trackingUtils } from '../utils/tracking';
import type { Product } from '../types/product';

/**
 * Hook cung cấp danh sách sản phẩm được cá nhân hóa cho người dùng.
 * Thuật toán kết hợp:
 * 1. Sản phẩm đã xem gần đây (Recently Viewed)
 * 2. Sản phẩm thuộc danh mục quan tâm (Category Interest)
 * 3. Gợi ý ngẫu nhiên từ kho hàng cao cấp nếu chưa có dữ liệu
 */
export const usePersonalizedProducts = (limit: number = 6) => {
    const { products, bestSellers, loading, fetchProducts, initializeHomeData } = useProducts();
    const [personalized, setPersonalized] = useState<Product[]>([]);
    const [isFetchingServer, setIsFetchingServer] = useState(false);

    useEffect(() => {
        if (products.length === 0 && !loading) {
            fetchProducts();
            initializeHomeData();
        }
    }, [products.length, loading, fetchProducts, initializeHomeData]);

    useEffect(() => {
        const fetchPersonalized = async () => {
            if (loading || (products.length === 0 && bestSellers.length === 0)) return;

            const token = localStorage.getItem('token');
            if (token) {
                try {
                    setIsFetchingServer(true);
                    const { recommendationApi } = await import('../api/recommendationApi');
                    const serverData = await recommendationApi.getPersonalized(limit);
                    if (serverData && serverData.length > 0) {
                        setPersonalized(serverData);
                        setIsFetchingServer(false);
                        return;
                    }
                } catch (e) {
                    console.error('Lỗi khi lấy gợi ý từ server:', e);
                } finally {
                    setIsFetchingServer(false);
                }
            }

            // Fallback sang logic local
            const recentlyViewedIds = trackingUtils.getRecentlyViewedIds();
            const topCategoryNames = trackingUtils.getTopInterests();

            const recentlyViewed = products.filter(p => recentlyViewedIds.includes(p.id))
                .sort((a, b) => recentlyViewedIds.indexOf(a.id) - recentlyViewedIds.indexOf(b.id));

            const relevantToInterests = products.filter(p =>
                topCategoryNames.includes(p.category?.name || '') &&
                !recentlyViewedIds.includes(p.id)
            );

            const fallback = bestSellers.filter(p =>
                !recentlyViewedIds.includes(p.id) &&
                !relevantToInterests.map(i => i.id).includes(p.id)
            );

            const combined = [
                ...recentlyViewed.slice(0, Math.ceil(limit * 0.4)),
                ...relevantToInterests.slice(0, Math.ceil(limit * 0.4)),
                ...fallback
            ].slice(0, limit);

            setPersonalized(combined);
        };

        fetchPersonalized();
    }, [products, bestSellers, loading, limit]);

    return {
        personalized,
        loading: loading || isFetchingServer
    };
};
