import { apiClient } from './apiClient';

export const fileApi = {
    /**
     * Tải lên hình ảnh lên MinIO.
     * @param file Tệp tin từ Input.
     * @param type Loại bucket (product, category, user).
     */
    uploadImage: async (file: File, type: 'product' | 'category' | 'user'): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient.fetch<{ url: string }>(`/upload/${type}`, {
            method: 'POST',
            body: formData,
        });
    }
};
