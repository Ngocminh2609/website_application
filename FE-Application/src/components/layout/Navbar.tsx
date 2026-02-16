import React, { useState } from 'react';
import { Layout, Menu, Space, Dropdown, Avatar, Badge, Drawer, Select } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, ShoppingCartOutlined, MenuOutlined, ShoppingOutlined, SearchOutlined, FireOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import BaseButton from '../common/BaseButton';
import type { User } from '../../types/auth';
import type { MenuProps } from 'antd';
import { useCart } from '../../hooks/useCart';
import { productApi } from '../../api/productApi';
import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types/product';
import { useNotifications } from '../../context/NotificationContext';

const { Header } = Layout;

interface NavbarProps {
    user: User | null;
    onLogout: () => void;
}

/**
 * Thanh điều hướng (Navbar) được tối ưu hóa với công cụ tìm kiếm thông minh.
 * Dọn dẹp các tab thừa và tập trung vào trải nghiệm tìm kiếm của người dùng.
 */
const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount } = useCart();
    const { bestSellers } = useProducts();
    const { unreadCount } = useNotifications();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State cho tìm kiếm và gợi ý
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);

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
        {
            key: 'orders',
            label: 'Đơn hàng của tôi',
            icon: <ShoppingOutlined />,
            onClick: () => navigate('/orders'),
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

    // Xử lý tìm kiếm sản phẩm theo từ khóa
    const handleSearch = async (value: string) => {
        setSearchValue(value);
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await productApi.searchProducts(value);
            setSearchResults(results);
        } catch (error) {
            console.error('Lỗi tìm kiếm:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Chuyển hướng khi chọn sản phẩm từ kết quả tìm kiếm hoặc gợi ý
    const onSelectProduct = (productId: string | number) => {
        navigate(`/products/${productId}`);
        setSearchValue('');
        setSearchResults([]);
    };

    // Thuật toán gợi ý: Nếu chưa nhập gì, hiện các sản phẩm bán chạy nhất.
    // Nếu đang nhập, hiện kết quả tìm kiếm tương ứng.
    const searchOptions = [
        {
            label: <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                {!searchValue ? 'GỢI Ý CHO BẠN' : `KẾT QUẢ CHO "${searchValue}"`}
            </span>,
            options: (!searchValue ? bestSellers.slice(0, 5) : searchResults.slice(0, 8)).map(product => ({
                value: product.id,
                label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0' }}>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {product.name}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--primary-color)' }}>
                                {product.price.toLocaleString()}đ
                                {!searchValue && <FireOutlined style={{ marginLeft: '8px', color: '#ff4d4f' }} />}
                            </div>
                        </div>
                    </div>
                )
            }))
        }
    ];

    return (
        <Header className="glass-effect" style={{
            position: 'fixed',
            zIndex: 1010,
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
                <div className="mobile-only" onClick={() => setIsMobileMenuOpen(true)}>
                    <MenuOutlined style={{ fontSize: '20px', color: '#fff', cursor: 'pointer' }} />
                </div>

                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    TECH NOVA
                </div>
            </Space>

            {/* Ô tìm kiếm trung tâm thay thế các tab Menu */}
            <div className="desktop-only" style={{ flex: 1, maxWidth: '600px', margin: '0 40px' }}>
                <Select
                    showSearch
                    value={searchValue || undefined}
                    placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                    defaultActiveFirstOption={false}
                    suffixIcon={<SearchOutlined style={{ color: 'var(--primary-color)', fontSize: '18px' }} />}
                    filterOption={false}
                    onSearch={handleSearch}
                    onSelect={onSelectProduct}
                    options={searchOptions}
                    loading={isSearching}
                    notFoundContent={searchValue ? "Không tìm thấy sản phẩm" : null}
                    dropdownStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '8px',
                        backdropFilter: 'blur(10px)'
                    }}
                    style={{
                        width: '100%',
                    }}
                    className="premium-search-input"
                />
            </div>

            <Space size="large">
                {user && (
                    <>
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Badge count={unreadCount} size="small" offset={[5, 0]} color="#ff4d4f">
                                <BellOutlined style={{ fontSize: '22px', color: '#fff' }} />
                            </Badge>
                        </div>
                        <div onClick={() => navigate('/cart')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Badge count={cartCount} size="small" offset={[5, 0]} color="#6366f1">
                                <ShoppingCartOutlined style={{ fontSize: '22px', color: '#fff' }} />
                            </Badge>
                        </div>
                    </>
                )}

                {user ? (
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar
                                src={user.avatarUrl}
                                icon={!user.avatarUrl && <UserOutlined />}
                                style={{ backgroundColor: '#6366f1' }}
                            />
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
