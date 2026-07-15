import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

/**
 * Service quản lý các yêu cầu xác thực tích hợp trực tiếp với Keycloak.
 */
export const authApi = {
  /**
   * Đăng ký tài khoản mới: gọi API BE để tạo user trong Keycloak + đồng bộ DB.
   */
  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }

    return result;
  },

  /**
   * Đăng nhập hệ thống bằng tài khoản mật khẩu trực tiếp qua Keycloak Token Endpoint.
   */
  login: async (data: LoginRequest, remember: boolean = false): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", "ecommerce-backend");
    params.append("client_secret", "ecommerce-backend-secret-placeholder");
    params.append("username", data.username);
    params.append("password", data.password);
    if (remember) {
      params.append("scope", "offline_access");
    }

    const response = await fetch(
      "http://localhost:8180/realms/ecommerce/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    if (!response.ok) {
      throw new Error(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.",
      );
    }

    const tokenData = await response.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    // Giải mã JWT để lấy thông tin user hiển thị trên UI (hỗ trợ UTF-8 tiếng Việt)
    const base64Url = accessToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const utf8String = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(utf8String);

    const isAdmin = payload.realm_access?.roles?.includes("ADMIN") || false;

    return {
      message: "Đăng nhập thành công",
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id: 1, // Dùng mock ID vì Keycloak dùng string UUID
        username: payload.preferred_username || payload.sub,
        email: payload.email || "",
        fullName: payload.name || payload.preferred_username || "User",
        role: isAdmin ? "ADMIN" : "USER",
      },
    };
  },

  /**
   * Đăng xuất.
   */
  logout: async (): Promise<string> => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return "Đăng xuất thành công";
  },

  /**
   * Đăng nhập bằng Google.
   * Chuyển hướng người dùng qua luồng đăng nhập mạng xã hội của Keycloak.
   */
  googleLogin: async (remember: boolean = false): Promise<void> => {
    if (remember) {
      localStorage.setItem("remember_me_oauth", "true");
    } else {
      localStorage.removeItem("remember_me_oauth");
    }
    const googleLoginUrl =
      `http://localhost:8180/realms/ecommerce/protocol/openid-connect/auth` +
      `?client_id=ecommerce-backend` +
      `&response_type=code` +
      `&scope=${remember ? "openid offline_access" : "openid"}` +
      `&kc_idp_hint=google` +
      `&redirect_uri=${encodeURIComponent("http://localhost:5173")}`;
    window.location.href = googleLoginUrl;
    return new Promise(() => {}); // Dừng luồng xử lý
  },
};
