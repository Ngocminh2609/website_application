import type { AuthResponse, User } from "../../../types/auth";

/**
 * Lưu thông tin phiên đăng nhập (token và thông tin user) vào localStorage
 */
export const storeAuthSession = (response: AuthResponse): void => {
  if (response.token) {
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
  }
};

/**
 * Lấy token hiện tại từ localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Lấy thông tin user hiện tại từ localStorage
 */
export const getAuthUser = (): User | null => {
  const user = localStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * Xóa thông tin phiên đăng nhập khỏi localStorage (Đăng xuất)
 */
export const clearAuthSession = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
