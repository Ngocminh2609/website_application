import React, { useState } from 'react';
import { ConfigProvider, theme, Layout, App as AntdApp } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CartPage from './pages/Cart/CartPage';
import ProductsPage from './pages/Product/ProductsPage';
import ProductDetailPage from './pages/Product/ProductDetailPage';
import PaymentSuccessPage from './pages/Payment/PaymentSuccessPage';
import OrdersPage from './pages/Order/OrdersPage';
import ProfilePage from './pages/Profile/ProfilePage';
import type { User } from './types/auth';
import { notification } from './utils/notification';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ChatWidget from './components/common/ChatWidget';
import { NotificationProvider } from './context/NotificationContext';
import { AdminChatProvider } from './context/AdminChatContext';

// Thay thế bằng Client ID của bạn từ Google Cloud Console
const GOOGLE_CLIENT_ID = "1051116450325-qneacpielnd6acgajc3kftfpk9nkjkqj.apps.googleusercontent.com";

/**
 * App Component - Quản lý Routing và Auth State.
 */
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Lỗi phân giải thông tin người dùng từ storage:', e);
      return null;
    }
  });

  const getNotificationUserId = () => {
    if (user?.role === 'ADMIN') return 'admin';
    return user ? `user-${user.id}` : null;
  };

  const handleLoginSuccess = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    notification.auth.logoutSuccess();
  };

  // Merge các field thay đổi vào user state để Navbar render lại avatar/tên ngay lập tức
  const handleUserUpdate = (updated: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updated } : prev);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif',
        },
      }}
    >
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AntdApp>
          <Router>
            <ProductProvider>
              <CartProvider>
                <NotificationProvider userId={getNotificationUserId()}>
                  <AdminChatProvider isAdmin={user?.role === 'ADMIN'}>
                    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
                      <Navbar user={user} onLogout={handleLogout} />

                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
                        <Route path="/orders" element={user ? <OrdersPage /> : <Navigate to="/login" />} />
                        <Route path="/profile" element={user ? <ProfilePage onUserUpdate={handleUserUpdate} /> : <Navigate to="/login" />} />
                        <Route path="/payment-success" element={<PaymentSuccessPage />} />

                        <Route
                          path="/admin"
                          element={
                            user?.role === 'ADMIN' ? (
                              <AdminDashboard />
                            ) : (
                              <Navigate to="/" replace />
                            )
                          }
                        />
                      </Routes>

                      <Footer />
                      <ChatWidget key={user ? String(user.id) : 'guest'} user={user} />
                    </Layout>
                  </AdminChatProvider>
                </NotificationProvider>
              </CartProvider>
            </ProductProvider>
          </Router>
        </AntdApp>
      </GoogleOAuthProvider>
    </ConfigProvider>
  );
};

export default App;
