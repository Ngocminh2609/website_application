import type { AuthResponse, User } from "../types/auth";
import { COMMON_STRINGS } from "../constants/Common/common";
import { notification } from "./notification";

/**
 * Lưu thông tin phiên đăng nhập (token và thông tin user) vào localStorage
 */
export const storeAuthSession = (response: AuthResponse): void => {
  if (response.token) {
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    if (response.refreshToken) {
      localStorage.setItem("refresh_token", response.refreshToken);
    }
  }
};

/**
 * Lấy token hiện tại từ localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Lấy refresh token hiện tại từ localStorage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};

/**
 * Cập nhật access token (và refresh token nếu có) sau khi refresh
 */
export const updateAuthTokens = (
  accessToken: string,
  refreshToken?: string | null,
): void => {
  localStorage.setItem("token", accessToken);
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }
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
 * Merge partial user fields vào user đã lưu trong localStorage
 */
export const updateStoredUser = (partial: Partial<User>): User | null => {
  const current = getAuthUser();
  if (!current) return null;
  const merged = { ...current, ...partial };
  localStorage.setItem("user", JSON.stringify(merged));
  return merged;
};

/**
 * Ghi đè toàn bộ user trong localStorage
 */
export const setStoredUser = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Xóa thông tin phiên đăng nhập khỏi localStorage (Đăng xuất)
 */
export const clearAuthSession = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

/**
 * Kiểm tra đã đăng nhập; nếu chưa thì hiện toast và trả về false.
 */
export const requireAuth = (): boolean => {
  if (getAuthToken()) return true;
  notification.warning(COMMON_STRINGS.productCard.loginRequired);
  return false;
};
