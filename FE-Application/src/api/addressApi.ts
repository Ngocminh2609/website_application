import { apiClient } from './apiClient';

export interface UserAddress {
    id: number;
    fullName: string;
    phoneNumber: string;
    province: string;
    ward: string;
    detailAddress: string;
    isDefault: boolean;
}

export const addressApi = {
    /**
     * Lấy danh sách địa chỉ của người dùng.
     */
    getAddresses: async (): Promise<UserAddress[]> => {
        return apiClient.fetch<UserAddress[]>('/addresses');
    },

    /**
     * Thêm địa chỉ mới.
     */
    addAddress: async (address: Omit<UserAddress, 'id'>): Promise<UserAddress> => {
        return apiClient.fetch<UserAddress>('/addresses', {
            method: 'POST',
            body: JSON.stringify(address)
        });
    },

    /**
     * Cập nhật địa chỉ.
     */
    updateAddress: async (id: number, address: Partial<UserAddress>): Promise<UserAddress> => {
        return apiClient.fetch<UserAddress>(`/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(address)
        });
    },

    /**
     * Xóa địa chỉ.
     */
    deleteAddress: async (id: number): Promise<void> => {
        return apiClient.fetch<void>(`/addresses/${id}`, {
            method: 'DELETE'
        });
    },

    /**
     * Đặt địa chỉ làm mặc định.
     */
    setDefault: async (id: number): Promise<void> => {
        return apiClient.fetch<void>(`/addresses/${id}/default`, {
            method: 'PATCH'
        });
    }
};
