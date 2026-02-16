import { apiClient } from "./apiClient";

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

export const orderApi = {
    getUserOrders: async (username: string): Promise<Order[]> => {
        return apiClient.fetch<Order[]>(`/v1/orders/user?username=${encodeURIComponent(username)}`, {
            method: 'GET'
        });
    },

    getAllOrders: async (): Promise<Order[]> => {
        return apiClient.fetch<Order[]>('/v1/orders/admin/all', {
            method: 'GET'
        });
    },

    updateOrderStatus: async (orderId: number, status: string): Promise<string> => {
        return apiClient.fetch<string>(`/v1/orders/admin/${orderId}/status?status=${status}`, {
            method: 'PUT'
        });
    },

    deleteOrder: async (orderId: number): Promise<string> => {
        return apiClient.fetch<string>(`/v1/orders/admin/${orderId}`, {
            method: 'DELETE'
        });
    }
};
