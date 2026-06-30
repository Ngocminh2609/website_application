import { apiClient } from './apiClient';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = '/auth';

// ─── API ─────────────────────────────────────────────────────────────────────

/**
 * Service quản lý các yêu cầu xác thực.
 * Sử dụng các Type-safe Interfaces thay vì 'any' để bắt lỗi sớm trong quá trình phát triển.
 */
export const authApi = {
    /**
     * Đăng ký tài khoản mới.
     * @param data - Thông tin đăng ký.
     * @returns Thông tin xác thực sau khi đăng ký thành công.
     */
    register: (data: RegisterRequest): Promise<AuthResponse> =>
        apiClient.fetch<AuthResponse>(`${BASE_PATH}/register`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * Đăng nhập hệ thống.
     * @param data - Thông tin đăng nhập.
     * @returns Thông tin xác thực sau khi đăng nhập thành công.
     */
    login: (data: LoginRequest): Promise<AuthResponse> =>
        apiClient.fetch<AuthResponse>(`${BASE_PATH}/login`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * Đăng xuất (xóa phiên làm việc).
     */
    logout: (): Promise<string> =>
        apiClient.fetch<string>(`${BASE_PATH}/logout`, { method: 'POST' }),

    /**
     * Đăng nhập bằng Google.
     * @param token - Token từ Google OAuth.
     * @returns Thông tin xác thực sau khi đăng nhập thành công.
     */
    googleLogin: (token: string): Promise<AuthResponse> =>
        apiClient.fetch<AuthResponse>(`${BASE_PATH}/google`, {
            method: 'POST',
            body: JSON.stringify({ token }),
        }),
};
