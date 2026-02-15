import React, { useState } from 'react';
import { Layout, Menu, Space, Dropdown, Avatar, Badge, Drawer } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, ShoppingCartOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import BaseButton from '../common/BaseButton';
import type { User } from '../../types/auth';
import type { MenuProps } from 'antd';
import { useCart } from '../../hooks/useCart';

const { Header } = Layout;

interface NavbarProps {
    user: User | null;
    onLogout: () => void;
}

/**
 * Thanh điều hướng (Navbar) đáp ứng (Responsive) 
 * Tự động điều chỉnh giao diện giữa Desktop và Mobile.
 */
const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems: MenuProps['items'] = [
        { key: '/', label: <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Trang Chủ</Link> },
        { key: '/products', label: <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Sản Phẩm</Link> },
    ];

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Hồ sơ cá nhân',
            icon: <UserOutlined />,
        },
        ...(user?.role === 'ADMIN' ? [
            {
                key: 'admin',
                label: 'Quản trị hệ thống',
                icon: <DashboardOutlined />,
                onClick: () => navigate('/admin'),
            }
        ] : []),
        { type: 'divider' },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            onClick: onLogout,
            danger: true,
        },
    ];

    return (
        <Header className="glass-effect" style={{
            position: 'fixed',
            zIndex: 1010, // Cao hơn Drawer một chút nếu cần
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--container-padding)',
            height: '70px',
            lineHeight: '70px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <Space size="middle">
                {/* Nút Hamburger cho Mobile */}
                <div className="mobile-only" onClick={() => setIsMobileMenuOpen(true)}>
                    <MenuOutlined style={{ fontSize: '20px', color: '#fff', cursor: 'pointer' }} />
                </div>

                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    TECH NOVA
                </div>
            </Space>

            {/* Menu chính cho Desktop */}
            <Menu
                theme="dark"
                mode="horizontal"
                items={menuItems}
                selectedKeys={[location.pathname]}
                className="desktop-only"
                style={{
                    flex: 1,
                    minWidth: 0,
                    justifyContent: 'center',
                    background: 'transparent',
                    borderBottom: 'none'
                }}
            />

            <Space size="large">
                {/* Icon Giỏ hàng */}
                {user && (
                    <div onClick={() => navigate('/cart')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Badge count={cartCount} size="small" offset={[5, 0]} color="#6366f1">
                            <ShoppingCartOutlined style={{ fontSize: '22px', color: '#fff' }} />
                        </Badge>
                    </div>
                )}

                {user ? (
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#6366f1' }} />
                            <span className="desktop-only" style={{ color: '#fff', fontWeight: 500 }}>
                                {user.fullName || user.username}
                            </span>
                        </Space>
                    </Dropdown>
                ) : (
                    <Space>
                        <BaseButton type="text" style={{ color: '#fff' }} onClick={() => navigate('/login')} className="desktop-only">
                            Đăng Nhập
                        </BaseButton>
                        <BaseButton type="primary" onClick={() => navigate('/register')}>
                            {window.innerWidth < 480 ? 'Tham gia' : 'Đăng Ký'}
                        </BaseButton>
                    </Space>
                )}
            </Space>

            {/* Mobile Drawer Navigation */}
            <Drawer
                title={<div className="logo">TECH NOVA</div>}
                placement="left"
                onClose={() => setIsMobileMenuOpen(false)}
                open={isMobileMenuOpen}
                width={280}
                styles={{ body: { backgroundColor: '#0f172a', padding: 0 }, header: { backgroundColor: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.1)' } }}
            >
                <Menu
                    mode="inline"
                    theme="dark"
                    items={menuItems}
                    selectedKeys={[location.pathname]}
                    style={{ background: 'transparent', borderRight: 'none' }}
                />
            </Drawer>
        </Header>
    );
};

export default Navbar;
