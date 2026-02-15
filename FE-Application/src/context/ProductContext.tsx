import React, { useState, useCallback, useRef } from 'react';
import { productApi } from '../api/productApi';
import { ProductContext } from '../hooks/useProducts';
import type { Product } from '../types/product';

/**
 * Provider quản lý danh sách sản phẩm.
 * Tối ưu hóa: Chống gọi trùng lặp và giữ cache trong bộ nhớ.
 */
import { categoryApi } from '../api/categoryApi';
import type { Category } from '../types/category';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [flashSales, setFlashSales] = useState<Product[]>([]);
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchingPromise = useRef<Promise<Product[]> | null>(null);
    const fetchingHomePromise = useRef<Promise<[Product[], Product[], Category[]]> | null>(null);
    const fetchingBrandPromises = useRef<Map<string, Promise<Product[]>>>(new Map());
    const isInitialized = useRef<boolean>(false);
    const isHomeInitialized = useRef<boolean>(false);

    const fetchProducts = useCallback(async (force: boolean = false) => {
        if (isInitialized.current && !force && products.length > 0) return;
        if (fetchingPromise.current) { await fetchingPromise.current; return; }

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

    const fetchProductsByBrand = useCallback(async (brand: string) => {
        const existingPromise = fetchingBrandPromises.current.get(brand);
        if (existingPromise) return existingPromise;

        const newPromise = productApi.getProductsByBrand(brand);
        fetchingBrandPromises.current.set(brand, newPromise);

        try {
            const data = await newPromise;
            return data;
        } finally {
            fetchingBrandPromises.current.delete(brand);
        }
    }, []);

    const initializeHomeData = useCallback(async (force: boolean = false) => {
        if (isHomeInitialized.current && !force) return;
        if (fetchingHomePromise.current) { await fetchingHomePromise.current; return; }

        try {
            setLoading(true);
            fetchingHomePromise.current = Promise.all([
                productApi.getFlashSales(),
                productApi.getBestSellers(),
                categoryApi.getAllCategories()
            ]);

            const [fs, bs, cats] = await fetchingHomePromise.current;
            setFlashSales(fs);
            setBestSellers(bs);
            setCategories(cats);
            isHomeInitialized.current = true;
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu trang chủ:', error);
        } finally {
            setLoading(false);
            fetchingHomePromise.current = null;
        }
    }, []);

    return (
        <ProductContext.Provider value={{
            products,
            flashSales,
            bestSellers,
            categories,
            loading,
            fetchProducts,
            fetchProductsByBrand,
            initializeHomeData
        }}>
            {children}
        </ProductContext.Provider>
    );
};
