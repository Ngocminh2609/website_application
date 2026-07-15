import { apiClient } from "./apiClient";
import type { Order } from "../types/order";

export type { Order, OrderItem } from "../types/order";

const BASE_PATH = "/v1/orders";
const ADMIN_PATH = `${BASE_PATH}/admin`;

export const orderApi = {
  /**
   * Lấy danh sách đơn hàng của người dùng hiện tại (từ JWT).
   */
  getUserOrders: (): Promise<Order[]> =>
    apiClient.fetch<Order[]>(`${BASE_PATH}/user`),

  /**
   * Lấy tất cả đơn hàng. (Yêu cầu quyền ADMIN)
   */
  getAllOrders: (): Promise<Order[]> =>
    apiClient.fetch<Order[]>(`${ADMIN_PATH}/all`),

  /**
   * Cập nhật trạng thái đơn hàng. (Yêu cầu quyền ADMIN)
   */
  updateOrderStatus: (orderId: number, status: string): Promise<string> =>
    apiClient.fetch<string>(
      `${ADMIN_PATH}/${orderId}/status?status=${status}`,
      { method: "PUT" },
    ),

  /**
   * Xóa đơn hàng. (Yêu cầu quyền ADMIN)
   */
  deleteOrder: (orderId: number): Promise<string> =>
    apiClient.fetch<string>(`${ADMIN_PATH}/${orderId}`, { method: "DELETE" }),
};
