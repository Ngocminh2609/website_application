import { apiClient } from "./apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImageBucketType = "product" | "category" | "user" | "banner";

export interface UploadImageResponse {
  url: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const fileApi = {
  /**
   * Tải lên hình ảnh lên MinIO.
   * @param file - Tệp tin từ Input.
   * @param type - Loại bucket (product, category, user).
   * @returns URL của hình ảnh sau khi tải lên.
   */
  uploadImage: (
    file: File,
    type: ImageBucketType,
  ): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.fetch<UploadImageResponse>(`/upload/${type}`, {
      method: "POST",
      body: formData,
    });
  },
};
