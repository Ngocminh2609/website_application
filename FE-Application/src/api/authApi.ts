import { apiClient } from './apiClient';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

/**
 * Service quản lý các yêu cầu xác thực.
 * Sử dụng các Type-safe Interfaces thay vì 'any' để bắt lỗi sớm trong quá trình phát triển.
 */
export const authApi = {
    // Đăng ký tài khoản mới
    register: (data: RegisterRequest) => apiClient.fetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Đăng nhập hệ thống
    login: (data: LoginRequest) => apiClient.fetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Đăng xuất (xóa phiên làm việc)
    logout: () => apiClient.fetch<string>('/auth/logout', {
        method: 'POST',
    }),
};
