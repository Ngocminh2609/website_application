import React, { useState, useCallback, useRef } from 'react';
import { productApi } from '../api/productApi';
import { ProductContext } from '../hooks/useProducts';
import type { Product } from '../types/product';

/**
 * Provider quản lý danh sách sản phẩm.
 * Tối ưu hóa: Chống gọi trùng lặp và giữ cache trong bộ nhớ.
 * Fix: Dùng loadingCount (counter) thay vì boolean để tránh race condition
 *      khi fetchProducts và initializeHomeData chạy đồng thời.
 */
import { categoryApi } from '../api/categoryApi';
import type { Category } from '../types/category';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [flashSales, setFlashSales] = useState<Product[]>([]);
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Dùng counter để tránh race condition: loading chỉ false khi TẤT CẢ requests hoàn thành
    const loadingCount = useRef(0);
    const updateLoading = useCallback((delta: 1 | -1) => {
        loadingCount.current += delta;
        setLoading(loadingCount.current > 0);
    }, []);

    const fetchingPromise = useRef<Promise<Product[]> | null>(null);
    const fetchingHomePromise = useRef<Promise<[Product[], Product[], Category[]]> | null>(null);
    const fetchingBrandPromises = useRef<Map<string, Promise<Product[]>>>(new Map());

    // Refs đánh dấu đã fetch thành công — tránh gọi lại sau khi đã có dữ liệu
    const productsFetched = useRef(false);
    const homeDataFetched = useRef(false);

    const fetchProducts = useCallback(async (force = false) => {
        if (productsFetched.current && !force) return; // Đã có dữ liệu, bỏ qua
        if (fetchingPromise.current) { await fetchingPromise.current; return; }

        try {
            updateLoading(1);
            fetchingPromise.current = productApi.getAllProducts();
            const data = await fetchingPromise.current;
            setProducts(data);
            productsFetched.current = true;
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
            productsFetched.current = true; // Tránh loop gọi liên tục khi lỗi
        } finally {
            updateLoading(-1);
            fetchingPromise.current = null;
        }
    }, [updateLoading]);

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

    const initializeHomeData = useCallback(async (force = false) => {
        if (homeDataFetched.current && !force) return; // Đã có dữ liệu, bỏ qua
        if (fetchingHomePromise.current) { await fetchingHomePromise.current; return; }

        try {
            updateLoading(1);
            fetchingHomePromise.current = Promise.all([
                productApi.getFlashSales(),
                productApi.getBestSellers(),
                categoryApi.getAllCategories()
            ]);

            const [fs, bs, cats] = await fetchingHomePromise.current;
            setFlashSales(fs);
            setBestSellers(bs);
            setCategories(cats);
            homeDataFetched.current = true;
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu trang chủ:', error);
            homeDataFetched.current = true; // Tránh loop gọi liên tục khi lỗi
        } finally {
            updateLoading(-1);
            fetchingHomePromise.current = null;
        }
    }, [updateLoading]);

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
