import { apiClient } from './apiClient';
import type { User } from '../types/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UpdateProfilePayload {
    fullName?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = '/users/me';

// ─── API ─────────────────────────────────────────────────────────────────────

/**
 * Service quản lý các yêu cầu liên quan đến Người dùng.
 */
export const userApi = {
    /**
     * Lấy thông tin hồ sơ người dùng hiện tại.
     * @returns Thông tin `User`.
     */
    getProfile: (): Promise<User> =>
        apiClient.fetch<User>(BASE_PATH),

    /**
     * Cập nhật hồ sơ người dùng.
     * @param data - Các trường cần cập nhật.
     * @returns Thông tin `User` sau khi cập nhật.
     */
    updateProfile: (data: UpdateProfilePayload): Promise<User> =>
        apiClient.fetch<User>(BASE_PATH, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    /**
     * Đổi mật khẩu người dùng.
     * @param data - Mật khẩu hiện tại và mật khẩu mới.
     * @returns Thông báo kết quả.
     */
    changePassword: (data: ChangePasswordPayload): Promise<{ message: string }> =>
        apiClient.fetch<{ message: string }>(`${BASE_PATH}/password`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    /**
     * Cập nhật theme giao diện của người dùng.
     * @param theme - Theme mong muốn ('light' | 'dark').
     * @returns Thông báo kết quả.
     */
    updateTheme: (theme: 'light' | 'dark'): Promise<{ message: string }> =>
        apiClient.fetch<{ message: string }>(`${BASE_PATH}/theme`, {
            method: 'PUT',
            body: JSON.stringify({ theme }),
        }),
};
