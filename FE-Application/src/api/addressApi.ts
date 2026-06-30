import { apiClient } from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserAddress {
    id: number;
    fullName: string;
    phoneNumber: string;
    province: string;
    ward: string;
    detailAddress: string;
    isDefault: boolean;
}

export type CreateAddressPayload = Omit<UserAddress, 'id'>;
export type UpdateAddressPayload = Partial<UserAddress>;

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = '/addresses';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const withJsonBody = <T>(data: T): RequestInit => ({
    body: JSON.stringify(data),
});

// ─── API ─────────────────────────────────────────────────────────────────────

export const addressApi = {
    /**
     * Lấy danh sách địa chỉ của người dùng.
     * @returns Danh sách `UserAddress`.
     */
    getAddresses: (): Promise<UserAddress[]> =>
        apiClient.fetch<UserAddress[]>(BASE_PATH),

    /**
     * Thêm địa chỉ mới.
     * @param address - Thông tin địa chỉ cần tạo (không bao gồm `id`).
     * @returns Địa chỉ vừa được tạo.
     */
    addAddress: (address: CreateAddressPayload): Promise<UserAddress> =>
        apiClient.fetch<UserAddress>(BASE_PATH, {
            method: 'POST',
            ...withJsonBody(address),
        }),

    /**
     * Cập nhật địa chỉ theo `id`.
     * @param id - ID của địa chỉ cần cập nhật.
     * @param address - Các trường cần cập nhật.
     * @returns Địa chỉ sau khi cập nhật.
     */
    updateAddress: (id: number, address: UpdateAddressPayload): Promise<UserAddress> =>
        apiClient.fetch<UserAddress>(`${BASE_PATH}/${id}`, {
            method: 'PUT',
            ...withJsonBody(address),
        }),

    /**
     * Xóa địa chỉ theo `id`.
     * @param id - ID của địa chỉ cần xóa.
     */
    deleteAddress: (id: number): Promise<void> =>
        apiClient.fetch<void>(`${BASE_PATH}/${id}`, { method: 'DELETE' }),

    /**
     * Đặt địa chỉ làm mặc định.
     * @param id - ID của địa chỉ cần đặt làm mặc định.
     */
    setDefault: (id: number): Promise<void> =>
        apiClient.fetch<void>(`${BASE_PATH}/${id}/default`, { method: 'PATCH' }),
};
