import type { CartItem } from "../../../types/cart";

/**
 * Tính tổng tiền của giỏ hàng
 */
export const calculateCartSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

/**
 * Định dạng tiền tệ VND cho giỏ hàng
 */
export const formatCartCurrency = (amount: number): string => {
  return `${amount.toLocaleString("vi-VN")}đ`;
};

/**
 * Tạo chuỗi địa chỉ đầy đủ từ chi tiết, phường/xã, tỉnh/thành
 */
export const getFullAddressString = (
  detailAddress: string,
  ward: string,
  province: string,
): string => {
  return `${detailAddress}, ${ward}, ${province}`;
};
