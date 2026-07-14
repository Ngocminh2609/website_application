import { ROLES } from "../components/common/Roles";

/**
 * Định nghĩa cấu trúc dữ liệu cho người dùng.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  role: typeof ROLES.USER | typeof ROLES.ADMIN;
  themePreference?: "light" | "dark";
  createdAt?: string;
}

/**
 * Cấu trúc dữ liệu trả về từ API Auth.
 */
export interface AuthResponse {
  message: string;
  user: User | null;
  token: string | null;
}

/**
 * Cấu trúc yêu cầu đăng nhập.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Cấu trúc yêu cầu đăng ký.
 */
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName?: string;
}
