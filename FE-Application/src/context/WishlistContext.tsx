import React, { useState, useEffect, useCallback } from "react";
import type { Product } from "../types/product";
import wishlistApi from "../api/wishlistApi";
import { notification } from "../utils/notification";
import { WishlistContext } from "./WishlistContextDefinition";
import { WISHLIST_STRINGS } from "../constants/Wishlist/wishlist";
import { requireAuth } from "../utils/auth";

/**
 * WishlistProvider - Quản lý trạng thái danh sách yêu thích toàn cục.
 */
export const WishlistProvider: React.FC<{
  children: React.ReactNode;
  isLoggedIn: boolean;
}> = ({ children, isLoggedIn }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  const refreshWishlist = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const data = await wishlistApi.getWishlist();
      setWishlistItems(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu thích:", error);
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
          console.error("Lỗi khi tải danh sách yêu thích:", error);
        }
      } else {
        if (isMounted)
          setWishlistItems((prev) => (prev.length > 0 ? [] : prev));
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  const addToWishlist = async (product: Product) => {
    if (!isLoggedIn) {
      requireAuth();
      return;
    }
    try {
      await wishlistApi.addToWishlist(product.id);
      setWishlistItems((prev) => {
        if (prev.some((item) => item.id === product.id)) return prev;
        return [...prev, product];
      });
      notification.wishlist.addSuccess();
    } catch {
      notification.error(WISHLIST_STRINGS.messages.addError);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      await wishlistApi.removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
      notification.wishlist.removeSuccess();
    } catch (error) {
      console.error("Lỗi khi xóa khỏi danh sách yêu thích:", error);
      notification.error(WISHLIST_STRINGS.messages.removeError);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
