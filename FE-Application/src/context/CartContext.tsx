import React, { useState, useEffect, useCallback, useRef } from "react";
import { cartApi as cartApiService } from "../api/cartApi";
import { CartContext } from "../hooks/useCart";
import type { Cart } from "../types/cart";

/**
 * Provider quản lý trạng thái giỏ hàng toàn cục.
 * Sửa lỗi: Loại bỏ vòng lặp (Infinite loop) bằng cách ổn định hóa callback và logic dependency.
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Sử dụng refs để quản lý trạng thái truy vấn mà không kích hoạt render lại
  const fetchingPromise = useRef<Promise<Cart> | null>(null);
  const lastTokenRef = useRef<string | null>(localStorage.getItem("token"));
  // Lưu vết trạng thái force load
  const isFirstLoad = useRef<boolean>(true);

  const refreshCart = useCallback(async (force: boolean = false) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCart(null);
      return;
    }

    // Nếu đã có dữ liệu, không ép buộc load và không phải lần đầu thì bỏ qua
    // Lưu ý: Không đưa 'cart' vào dependency của useCallback để tránh vòng lặp
    if (!force && !isFirstLoad.current) return;

    // Chống trùng lặp yêu cầu (Single Flight)
    if (fetchingPromise.current) {
      await fetchingPromise.current;
      return;
    }

    try {
      setLoading(true);
      fetchingPromise.current = cartApiService.getCart();
      const data = await fetchingPromise.current;
      setCart(data);
      isFirstLoad.current = false;
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
      if (error instanceof Error && error.message.includes("401")) {
        setCart(null);
      }
    } finally {
      setLoading(false);
      fetchingPromise.current = null;
    }
  }, []); // Dependency mảng rỗng để hàm ổn định 100%, không bao giờ thay đổi

  // Effect 1: Khởi tạo giỏ hàng khi App load hoặc Token thay đổi thực sự
  useEffect(() => {
    // Hàm định kỳ kiểm tra thay đổi Token (vì Token không nằm trong React State chính)
    const checkTokenChange = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== lastTokenRef.current) {
        lastTokenRef.current = currentToken;
        isFirstLoad.current = true; // Cho phép tải lại khi đổi account

        if (!currentToken) {
          setCart(null);
        } else {
          refreshCart(true);
        }
      }
    }, 800);

    // Chạy lần đầu tiên ngay lập tức
    refreshCart();

    return () => clearInterval(checkTokenChange);
  }, [refreshCart]);

  const cartCount =
    cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, refreshCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};
