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
import type { User } from './types/auth';
import { notification } from './utils/notification';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Thay thế bằng Client ID của bạn từ Google Cloud Console
const GOOGLE_CLIENT_ID = "1051116450325-qneacpielnd6acgajc3kftfpk9nkjkqj.apps.googleusercontent.com";

/**
 * App Component - Quản lý Routing và Auth State.
 */
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

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
          <ProductProvider>
            <CartProvider>
              <Router>
                <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
                  <Navbar user={user} onLogout={handleLogout} />

                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />

                    {/* Route bảo vệ cho Admin */}
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
                </Layout>
              </Router>
            </CartProvider>
          </ProductProvider>
        </AntdApp>
      </GoogleOAuthProvider>
    </ConfigProvider>
  );
};

export default App;
