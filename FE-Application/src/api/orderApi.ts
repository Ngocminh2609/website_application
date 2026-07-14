import { apiClient } from "./apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  phoneNumber: string;
  orderDate: string;
  items: OrderItem[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = "/v1/orders";
const ADMIN_PATH = `${BASE_PATH}/admin`;

// ─── API ─────────────────────────────────────────────────────────────────────

export const orderApi = {
  /**
   * Lấy danh sách đơn hàng của người dùng.
   * @param username - Tên người dùng cần lấy đơn hàng.
   * @returns Danh sách `Order`.
   */
  getUserOrders: (username: string): Promise<Order[]> =>
    apiClient.fetch<Order[]>(
      `${BASE_PATH}/user?username=${encodeURIComponent(username)}`,
    ),

  /**
   * Lấy tất cả đơn hàng. (Yêu cầu quyền ADMIN)
   * @returns Danh sách `Order`.
   */
  getAllOrders: (): Promise<Order[]> =>
    apiClient.fetch<Order[]>(`${ADMIN_PATH}/all`),

  /**
   * Cập nhật trạng thái đơn hàng. (Yêu cầu quyền ADMIN)
   * @param orderId - ID của đơn hàng.
   * @param status - Trạng thái mới.
   * @returns Thông báo kết quả.
   */
  updateOrderStatus: (orderId: number, status: string): Promise<string> =>
    apiClient.fetch<string>(
      `${ADMIN_PATH}/${orderId}/status?status=${status}`,
      { method: "PUT" },
    ),

  /**
   * Xóa đơn hàng. (Yêu cầu quyền ADMIN)
   * @param orderId - ID của đơn hàng cần xóa.
   * @returns Thông báo kết quả.
   */
  deleteOrder: (orderId: number): Promise<string> =>
    apiClient.fetch<string>(`${ADMIN_PATH}/${orderId}`, { method: "DELETE" }),
};
