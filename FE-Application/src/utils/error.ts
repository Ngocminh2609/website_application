/**
 * Lấy message từ Error hoặc fallback string.
 */
export const getErrorMessage = (
  error: unknown,
  fallback: string = "Đã có lỗi xảy ra",
): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error) {
    return error;
  }
  return fallback;
};
