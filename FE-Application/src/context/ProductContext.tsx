import React, { useState, useCallback, useRef } from 'react';
import { productApi } from '../api/productApi';
import { ProductContext } from '../hooks/useProducts';
import type { Product } from '../types/product';

/**
 * Provider quản lý danh sách sản phẩm.
 * Tối ưu hóa: Chống gọi trùng lặp và giữ cache trong bộ nhớ.
 */
export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchingPromise = useRef<Promise<Product[]> | null>(null);
    const isInitialized = useRef<boolean>(false);

    const fetchProducts = useCallback(async (force: boolean = false) => {
        // Nếu đã có dữ liệu và không ép buộc thì dùng cache
        if (isInitialized.current && !force && products.length > 0) return;

        // Nếu đang tải rồi thì đợi promise hiện tại (Single Flight)
        if (fetchingPromise.current) {
            await fetchingPromise.current;
            return;
        }

        try {
            setLoading(true);
            fetchingPromise.current = productApi.getAllProducts();
            const data = await fetchingPromise.current;

            setProducts(data);
            isInitialized.current = true;
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
        } finally {
            setLoading(false);
            fetchingPromise.current = null;
        }
    }, [products.length]);

    return (
        <ProductContext.Provider value={{ products, loading, fetchProducts }}>
            {children}
        </ProductContext.Provider>
    );
};
