/**
 * Cấu hình API Client dùng chung cho toàn hệ thống.
 * Tích hợp tự động gắn Token JWT vào Header 'Authorization' để xác thực với Backend.
 */
import { getBaseApiUrl } from "../utils/url";
import {
  clearAuthSession,
  getAuthToken,
  getRefreshToken,
  updateAuthTokens,
} from "../utils/auth";
import { KEYCLOAK_CONFIG } from "../constants/Auth/keycloak";

const BASE_URL = getBaseApiUrl();

/** Single-flight: nhiều request 401 cùng lúc chỉ refresh token một lần. */
let refreshPromise: Promise<string | null> | null = null;

function clearAuthAndRedirectToLogin(): void {
  clearAuthSession();
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("client_id", KEYCLOAK_CONFIG.clientId);
      params.append("client_secret", KEYCLOAK_CONFIG.clientSecret);
      params.append("refresh_token", refreshToken);

      const refreshResponse = await fetch(KEYCLOAK_CONFIG.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!refreshResponse.ok) {
        return null;
      }

      const tokenData = await refreshResponse.json();
      updateAuthTokens(tokenData.access_token, tokenData.refresh_token);
      return tokenData.access_token as string;
    } catch (err) {
      console.error("Lỗi khi tự động làm mới token:", err);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function buildHeaders(
  options?: RequestInit,
  accessToken?: string | null,
): HeadersInit {
  const headers: HeadersInit = {
    ...options?.headers,
  };

  if (!(options?.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  if (accessToken) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${accessToken}`;
  }

  return headers;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return {} as T;
}

export const apiClient = {
  /**
   * Hàm fetch bọc (Wrapper) để xử lý các logic chung như xác thực và parse JSON.
   */
  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: buildHeaders(options, token),
    });

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
          ...options,
          headers: buildHeaders(options, newAccessToken),
        });

        if (retryResponse.ok) {
          return parseResponse<T>(retryResponse);
        }

        // Refresh ok nhưng API vẫn 401/lỗi → không xóa session nếu không phải 401
        if (retryResponse.status !== 401) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Lỗi hệ thống (${retryResponse.status})`,
          );
        }
      }

      clearAuthAndRedirectToLogin();
      return {} as T;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Lỗi hệ thống (${response.status})`);
    }

    return parseResponse<T>(response);
  },
};
