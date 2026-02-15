/**
 * Cấu hình API Client dùng chung cho toàn hệ thống.
 * Tích hợp tự động gắn Token JWT vào Header 'Authorization' để xác thực với Backend.
 */
const BASE_URL = 'http://localhost:8080/api';

export const apiClient = {
    /**
     * Hàm fetch bọc (Wrapper) để xử lý các logic chung như xác thực và parse JSON.
     */
    async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
        // Lấy token từ LocalStorage (được lưu sau khi đăng nhập thành công)
        const token = localStorage.getItem('token');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options?.headers,
        };

        // Nếu có token, tự động gắn vào Header theo chuẩn Bearer
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: headers,
        });

        if (!response.ok) {
            // Ném lỗi chi tiết để các thành phần UI có thể xử lý (như hiện thông báo antd)
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Lỗi hệ thống (${response.status})`);
        }

        // Một số API logout có thể trả về text thay vì JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }

        return {} as T;
    }
};
