import React, { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types/product';
import wishlistApi from '../api/wishlistApi';
import { notification } from '../utils/notification';
import { WishlistContext } from './WishlistContextDefinition';

/**
 * WishlistProvider - Quản lý trạng thái danh sách yêu thích toàn cục.
 */
export const WishlistProvider: React.FC<{ children: React.ReactNode; isLoggedIn: boolean }> = ({ children, isLoggedIn }) => {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

    const refreshWishlist = useCallback(async () => {
        if (!isLoggedIn) return;
        try {
            const data = await wishlistApi.getWishlist();
            setWishlistItems(data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách yêu thích:', error);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (isLoggedIn) {
                try {
                    const data = await wishlistApi.getWishlist();
                    if (isMounted) setWishlistItems(data);
                } catch (error) {
                    console.error('Lỗi khi tải danh sách yêu thích:', error);
                }
            } else {
                if (isMounted) setWishlistItems(prev => prev.length > 0 ? [] : prev);
            }
        };
        load();
        return () => { isMounted = false; };
    }, [isLoggedIn]);

    const addToWishlist = async (product: Product) => {
        if (!isLoggedIn) {
            notification.error('Vui lòng đăng nhập để sử dụng tính năng này');
            return;
        }
        try {
            await wishlistApi.addToWishlist(product.id);
            setWishlistItems(prev => {
                if (prev.some(item => item.id === product.id)) return prev;
                return [...prev, product];
            });
            notification.success('Đã thêm vào danh sách yêu thích');
        } catch {
            notification.error('Không thể thêm vào danh sách yêu thích');
        }
    };

    const removeFromWishlist = async (productId: number) => {
        try {
            await wishlistApi.removeFromWishlist(productId);
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
            notification.success('Đã xóa khỏi danh sách yêu thích');
        } catch (error) {
            console.error('Lỗi khi xóa khỏi danh sách yêu thích:', error);
            notification.error('Không thể xóa khỏi danh sách yêu thích');
        }
    };

    const isInWishlist = (productId: number) => {
        return wishlistItems.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, refreshWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
