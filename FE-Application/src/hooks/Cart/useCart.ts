import { createContext, useContext } from "react";
import type { Cart } from "../../types/cart";

export interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  refreshCart: (force?: boolean) => Promise<void>;
  loading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

/**
 * Hook để sử dụng dữ liệu giỏ hàng trong các component.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng trong CartProvider");
  }
  return context;
};
