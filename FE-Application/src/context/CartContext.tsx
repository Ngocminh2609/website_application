import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cartApi as cartApiService } from '../api/cartApi';
import { CartContext } from '../hooks/useCart';
import type { Cart } from '../types/cart';

/**
 * Provider quản lý trạng thái giỏ hàng toàn cục.
 * Đã tối ưu hóa Single-Flight Request: Dù 10 component gọi cùng lúc, chỉ 1 API duy nhất được thực thi.
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Biến lưu trữ kết quả của yêu cầu đang chạy
    const fetchingPromise = useRef<Promise<Cart> | null>(null);
    const isFirstLoad = useRef<boolean>(true);

    const refreshCart = useCallback(async (force: boolean = false) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setCart(null);
            return;
        }

        // Nếu đã có dữ liệu và không ép buộc, và không phải lần đầu, thì không làm gì
        if (cart && !force && !isFirstLoad.current) return;

        // Nếu đang có một yêu cầu khác đang chạy, hãy đợi yêu cầu đó thay vì tạo mới
        if (fetchingPromise.current) {
            await fetchingPromise.current;
            return;
        }

        try {
            setLoading(true);
            // Tạo một yêu cầu mới và lưu vào promise để các component khác dùng chung
            fetchingPromise.current = cartApiService.getCart();
            const data = await fetchingPromise.current;

            setCart(data);
            isFirstLoad.current = false;
        } catch (error) {
            console.error('Lỗi tải giỏ hàng:', error);
        } finally {
            setLoading(false);
            fetchingPromise.current = null; // Giải phóng sau khi xong
        }
    }, [cart]);

    // Chỉ tự động tải lần đầu tiên khi App khởi chạy
    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const cartCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{ cart, cartCount, refreshCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};
