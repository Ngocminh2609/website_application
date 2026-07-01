import { apiClient } from './apiClient';
import type { Banner } from '../types/banner';

const BASE_PATH = '/banners';
const ADMIN_PATH = `${BASE_PATH}/admin`;

export const bannerApi = {
    /**
     * Lấy danh sách banner đang hoạt động cho người dùng. (Công khai)
     * @returns Danh sách `Banner`.
     */
    getActiveBanners: (): Promise<Banner[]> =>
        apiClient.fetch<Banner[]>(BASE_PATH),

    // ─── Admin ───────────────────────────────────────────────────────────────

    /**
     * Lấy toàn bộ danh sách banner cho trang quản trị. (Yêu cầu quyền ADMIN)
     * @returns Danh sách `Banner`.
     */
    getAll: (): Promise<Banner[]> =>
        apiClient.fetch<Banner[]>(ADMIN_PATH),

    /**
     * Lấy chi tiết banner theo ID. (Yêu cầu quyền ADMIN)
     * @param id - ID của banner.
     * @returns Thông tin `Banner`.
     */
    getById: (id: number): Promise<Banner> =>
        apiClient.fetch<Banner>(`${ADMIN_PATH}/${id}`),

    /**
     * Tạo banner mới. (Yêu cầu quyền ADMIN)
     * @param banner - Dữ liệu banner cần tạo.
     * @returns Banner vừa tạo.
     */
    create: (banner: Partial<Banner>): Promise<Banner> =>
        apiClient.fetch<Banner>(ADMIN_PATH, {
            method: 'POST',
            body: JSON.stringify(banner),
        }),

    /**
     * Cập nhật thông tin banner. (Yêu cầu quyền ADMIN)
     * @param id - ID của banner cần cập nhật.
     * @param banner - Dữ liệu banner cần cập nhật.
     * @returns Banner sau khi cập nhật.
     */
    update: (id: number, banner: Partial<Banner>): Promise<Banner> =>
        apiClient.fetch<Banner>(`${ADMIN_PATH}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(banner),
        }),

    /**
     * Xóa banner. (Yêu cầu quyền ADMIN)
     * @param id - ID của banner cần xóa.
     */
    delete: (id: number): Promise<void> =>
        apiClient.fetch<void>(`${ADMIN_PATH}/${id}`, {
            method: 'DELETE',
        }),
};
