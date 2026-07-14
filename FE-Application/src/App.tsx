import React, { useState, useEffect } from "react";
import { ConfigProvider, theme, Layout, App as AntdApp } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CartPage from "./pages/Cart/CartPage";
import ProductsPage from "./pages/Product/ProductsPage";
import ProductDetailPage from "./pages/Product/ProductDetailPage";
import WishlistPage from "./pages/Wishlist/WishlistPage";
import PaymentSuccessPage from "./pages/Payment/PaymentSuccessPage";
import OrdersPage from "./pages/Order/OrdersPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import SearchPage from "./pages/Product/SearchPage";
import type { User } from "./types/auth";
import { notification } from "./utils/notification";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ChatWidget from "./components/common/ChatWidget";
import { NotificationProvider } from "./context/NotificationContext";
import { AdminChatProvider } from "./context/AdminChatContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CompareProvider } from "./context/CompareContext";
import { userApi } from "./api/userApi";
import CompareBar from "./components/common/CompareBar";
import ComparePage from "./pages/Product/ComparePage";
import ReloadPrompt from "./components/pwa/ReloadPrompt";
import ScrollToTop from "./components/common/ScrollToTop";
import { ROLES } from "./components/common/roles";

// Thay thế bằng Client ID của bạn từ Google Cloud Console
const GOOGLE_CLIENT_ID =
  "1051116450325-qneacpielnd6acgajc3kftfpk9nkjkqj.apps.googleusercontent.com";

/**
 * App Component - Quản lý Routing, Auth State và Theme.
 */
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Lỗi phân giải thông tin người dùng từ storage:", e);
      return null;
    }
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Ưu tiên tùy chọn của người dùng nếu đã đăng nhập, nếu không dùng localStorage hoặc default dark
    if (user?.themePreference) return user.themePreference === "dark";
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true; // Mặc định dark theo yêu cầu aesthetics
  });

  // Xử lý OAuth2 redirect code từ Keycloak (cho Google Login hoặc User Registration)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      const exchangeCode = async () => {
        try {
          const params = new URLSearchParams();
          params.append("grant_type", "authorization_code");
          params.append("client_id", "ecommerce-backend");
          params.append(
            "client_secret",
            "ecommerce-backend-secret-placeholder",
          );
          params.append("code", code);
          params.append("redirect_uri", "http://localhost:5173");

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

          if (response.ok) {
            const tokenData = await response.json();
            const accessToken = tokenData.access_token;

            // Giải mã token để lấy thông tin User (hỗ trợ UTF-8 tiếng Việt)
            const base64Url = accessToken.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const utf8String = decodeURIComponent(
              window
                .atob(base64)
                .split("")
                .map(
                  (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2),
                )
                .join(""),
            );
            const payload = JSON.parse(utf8String);

            const isAdmin =
              payload.realm_access?.roles?.includes("ADMIN") || false;
            const newUser: User = {
              id: 1,
              username: payload.preferred_username || payload.sub,
              email: payload.email || "",
              fullName: payload.name || payload.preferred_username || "User",
              role: isAdmin ? "ADMIN" : "USER",
            };

            localStorage.setItem("token", accessToken);
            localStorage.setItem("user", JSON.stringify(newUser));
            setUser(newUser);
            notification.auth.loginSuccess();

            // Xóa query parameters trên thanh địa chỉ mà không reload trang
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
          }
        } catch (err) {
          console.error("Lỗi khi đổi code lấy token từ Keycloak:", err);
        }
      };
      exchangeCode();
    }
  }, []);

  // Đồng bộ theme khi thông tin người dùng được tải lần đầu hoặc khi đăng nhập
  useEffect(() => {
    if (user?.themePreference) {
      const userThemeIsDark = user.themePreference === "dark";
      // Sử dụng setTimeout(0) để tránh cảnh báo cascading render đồng bộ
      const timer = setTimeout(() => {
        setIsDarkMode(userThemeIsDark);
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Chỉ chạy khi User ID thay đổi (Đăng nhập/Đăng xuất)

  // Áp dụng data-theme vào thẻ root để kích hoạt CSS variables
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
  }, [isDarkMode]);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    const themeStr = newMode ? "dark" : "light";
    localStorage.setItem("theme", themeStr);

    // Nếu đã đăng nhập, đồng bộ lên server
    if (user) {
      try {
        await userApi.updateTheme(themeStr);
        // Cập nhật local user state
        const updatedUser = {
          ...user,
          themePreference: themeStr as "light" | "dark",
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Không thể đồng bộ giao diện lên server:", error);
      }
    }
  };

  const getNotificationUserId = () => {
    if (user?.role === ROLES.ADMIN) return "admin";
    return user ? `user-${user.id}` : null;
  };

  const handleLoginSuccess = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    notification.auth.logoutSuccess();
  };

  const handleUserUpdate = (updated: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : prev));
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#6366f1",
          borderRadius: 8,
          fontFamily: "Inter, sans-serif",
        },
      }}
    >
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AntdApp>
          <Router>
            <ScrollToTop />
            <ProductProvider>
              <CartProvider>
                <WishlistProvider isLoggedIn={!!user}>
                  <CompareProvider>
                    <NotificationProvider userId={getNotificationUserId()}>
                      <AdminChatProvider isAdmin={user?.role === ROLES.ADMIN}>
                        <Layout
                          style={{
                            minHeight: "100vh",
                            background: "transparent",
                          }}
                        >
                          <Navbar
                            user={user}
                            onLogout={handleLogout}
                            isDarkMode={isDarkMode}
                            onToggleTheme={toggleTheme}
                          />

                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route
                              path="/products"
                              element={<ProductsPage />}
                            />
                            <Route path="/search" element={<SearchPage />} />
                            <Route
                              path="/product/:id"
                              element={<ProductDetailPage />}
                            />
                            <Route
                              path="/login"
                              element={
                                <LoginPage
                                  onLoginSuccess={handleLoginSuccess}
                                />
                              }
                            />
                            <Route
                              path="/register"
                              element={<RegisterPage />}
                            />
                            <Route
                              path="/cart"
                              element={
                                user ? <CartPage /> : <Navigate to="/login" />
                              }
                            />
                            <Route
                              path="/wishlist"
                              element={
                                user ? (
                                  <WishlistPage />
                                ) : (
                                  <Navigate to="/login" />
                                )
                              }
                            />
                            <Route
                              path="/orders"
                              element={
                                user ? <OrdersPage /> : <Navigate to="/login" />
                              }
                            />
                            <Route
                              path="/profile"
                              element={
                                user ? (
                                  <ProfilePage
                                    onUserUpdate={handleUserUpdate}
                                  />
                                ) : (
                                  <Navigate to="/login" />
                                )
                              }
                            />
                            <Route
                              path="/payment-success"
                              element={<PaymentSuccessPage />}
                            />
                            <Route path="/compare" element={<ComparePage />} />

                            <Route
                              path="/admin"
                              element={
                                user?.role === ROLES.ADMIN ? (
                                  <AdminDashboard />
                                ) : (
                                  <Navigate to="/" replace />
                                )
                              }
                            />
                          </Routes>

                          <Footer />
                          <ChatWidget
                            key={user ? String(user.id) : "guest"}
                            user={user}
                          />
                          <CompareBar />
                          <ReloadPrompt />
                        </Layout>
                      </AdminChatProvider>
                    </NotificationProvider>
                  </CompareProvider>
                </WishlistProvider>
              </CartProvider>
            </ProductProvider>
          </Router>
        </AntdApp>
      </GoogleOAuthProvider>
    </ConfigProvider>
  );
};

export default App;
