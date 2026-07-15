import type { CartItem } from "../../../types/cart";
import { formatVnd } from "../../../utils/format";

/**
 * Tính tổng tiền của giỏ hàng
 */
export const calculateCartSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

/**
 * Định dạng tiền tệ VND cho giỏ hàng (không khoảng trắng trước "đ")
 */
export const formatCartCurrency = (amount: number): string => {
  return formatVnd(amount, false);
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
