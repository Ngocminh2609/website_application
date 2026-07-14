import React, { useState } from "react";
import {
  Layout,
  Menu,
  Space,
  Dropdown,
  Avatar,
  Badge,
  Drawer,
  Select,
  List,
  Typography,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  ShoppingOutlined,
  SearchOutlined,
  FireOutlined,
  BellOutlined,
  MessageOutlined,
  HeartOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BaseButton from "../common/BaseButton";
import type { User } from "../../types/auth";
import type { MenuProps } from "antd";
import { useCart } from "../../hooks/useCart";
import { productApi } from "../../api/productApi";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types/product";
import { useNotifications } from "../../context/NotificationContext";
import { useAdminChat } from "../../context/useAdminChat";
import { useWishlist } from "../../hooks/useWishlist";

const { Header } = Layout;
const { Text } = Typography;

import {
  FALLBACK_IMAGE,
  ICON_WRAPPER_STYLE,
  themeText,
  themeBorder,
  getNavbarNotificationMenuStyle,
} from "../../styles/commonStyles";

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (target.dataset.errored === "true") return;
  target.dataset.errored = "true";
  target.src = FALLBACK_IMAGE;
};

// ─── NavIconBadge Sub-component ──────────────────────────────────────────────
interface NavIconBadgeProps {
  count: number | string;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
  id?: string;
  title: string;
}

const NavIconBadge: React.FC<NavIconBadgeProps> = ({
  count,
  color,
  icon,
  onClick,
  id,
  title,
}) => (
  <Tooltip title={title}>
    <div id={id} onClick={onClick} style={ICON_WRAPPER_STYLE}>
      <Badge count={count} size="small" offset={[5, 0]} color={color}>
        {icon}
      </Badge>
    </div>
  </Tooltip>
);

// ─── Navbar Component ─────────────────────────────────────────────────────────
interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

/**
 * Thanh điều hướng (Navbar) được tối ưu hóa với công cụ tìm kiếm thông minh,
 * hỗ trợ chuyển đổi giao diện Dark/Light và quản lý danh sách yêu thích.
 */
const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  isDarkMode,
  onToggleTheme,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { bestSellers } = useProducts();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const { totalUnread: chatUnread } = useAdminChat();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State cho tìm kiếm và gợi ý
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Đồng bộ ô tìm kiếm với URL khi người dùng ở trang search hoặc product detail
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setSearchValue(q);
    } else if (!location.pathname.startsWith("/product/")) {
      setSearchValue("");
    }
  }, [location.search, location.pathname]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      label: (
        <Link to="/" onClick={closeMobileMenu}>
          Trang Chủ
        </Link>
      ),
    },
    {
      key: "/products",
      label: (
        <Link to="/products" onClick={closeMobileMenu}>
          Sản Phẩm
        </Link>
      ),
    },
    {
      key: "/wishlist",
      label: (
        <Link to="/wishlist" onClick={closeMobileMenu}>
          Yêu Thích
        </Link>
      ),
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "wishlist",
      label: "Danh sách yêu thích",
      icon: <HeartOutlined />,
      onClick: () => navigate("/wishlist"),
    },
    {
      key: "orders",
      label: "Đơn hàng của tôi",
      icon: <ShoppingOutlined />,
      onClick: () => navigate("/orders"),
    },
    ...(user?.role === "ADMIN"
      ? [
          {
            key: "admin",
            label: "Quản trị hệ thống",
            icon: <DashboardOutlined />,
            onClick: () => navigate("/admin"),
          },
        ]
      : []),
    { type: "divider" },
    {
      key: "logout",
      label: "Đăng xuất",
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
      console.error("Lỗi tìm kiếm:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Điều hướng đến trang tìm kiếm đầy đủ
  const goToSearchPage = (query: string) => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchResults([]);
  };

  // Chuyển hướng khi chọn sản phẩm từ kết quả tìm kiếm hoặc gợi ý
  const onSelectProduct = (productId: string | number) => {
    const product = [...searchResults, ...bestSellers].find(
      (p) => String(p.id) === String(productId),
    );
    if (product) setSearchValue(product.name);
    navigate(`/product/${productId}`);
    setSearchResults([]);
  };

  // Nội dung dropdown thông báo
  const notificationMenu = (
    <div style={getNavbarNotificationMenuStyle(isDarkMode)}>
      <div
        style={{
          padding: "16px",
          borderBottom: `1px solid ${themeBorder(isDarkMode)}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong style={{ color: themeText(isDarkMode), fontSize: "16px" }}>
          Thông báo
        </Text>
        {unreadCount > 0 && (
          <BaseButton
            type="text"
            size="small"
            onClick={() => markAllAsRead()}
            style={{
              color: "var(--primary-color)",
              fontSize: "12px",
              padding: 0,
            }}
          >
            Đánh dấu tất cả đã đọc
          </BaseButton>
        )}
      </div>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {notifications.length > 0 ? (
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                onClick={() => !item.isRead && markAsRead(item.id)}
                style={{
                  padding: "12px 16px",
                  borderBottom: `1px solid ${themeBorder(isDarkMode)}`,
                  cursor: "pointer",
                  backgroundColor: item.isRead
                    ? "transparent"
                    : isDarkMode
                      ? "rgba(99, 102, 241, 0.05)"
                      : "rgba(99, 102, 241, 0.02)",
                  transition: "all 0.3s",
                }}
              >
                <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: item.isRead
                        ? "transparent"
                        : "var(--primary-color)",
                      marginTop: "6px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: item.isRead
                          ? isDarkMode
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.45)"
                          : themeText(isDarkMode),
                        fontSize: "14px",
                        display: "block",
                      }}
                    >
                      {item.message}
                    </Text>
                    <Text
                      style={{
                        color: isDarkMode
                          ? "rgba(255,255,255,0.4)"
                          : "rgba(0,0,0,0.3)",
                        fontSize: "11px",
                      }}
                    >
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <BellOutlined
              style={{
                fontSize: "32px",
                color: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                marginBottom: "12px",
              }}
            />
            <div
              style={{
                color: isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
              }}
            >
              Không có thông báo nào
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const searchOptions = [
    {
      label: (
        <span
          style={{
            color: isDarkMode ? "var(--text-muted)" : "rgba(0,0,0,0.45)",
            fontSize: "12px",
          }}
        >
          {!searchValue ? "GỢI Ý CHO BẠN" : `KẾT QUẢ CHO "${searchValue}"`}
        </span>
      ),
      options: (!searchValue
        ? bestSellers.slice(0, 5)
        : searchResults.slice(0, 8)
      ).map((product) => ({
        value: product.id,
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "4px 0",
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "8px",
                border: `1px solid ${themeBorder(isDarkMode)}`,
              }}
              onError={handleImgError}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 500,
                  color: themeText(isDarkMode),
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {product.name}
              </div>
              <div style={{ fontSize: "12px", color: "var(--primary-color)" }}>
                {product.price.toLocaleString()}đ
                {!searchValue && (
                  <FireOutlined
                    style={{ marginLeft: "8px", color: "#ff4d4f" }}
                  />
                )}
              </div>
            </div>
          </div>
        ),
      })),
    },
    ...(searchValue
      ? [
          {
            label: (
              <div
                onClick={() => goToSearchPage(searchValue)}
                style={{
                  padding: "10px",
                  textAlign: "center" as const,
                  cursor: "pointer",
                  color: "var(--primary-color)",
                  fontWeight: 600,
                  borderTop: `1px solid ${themeBorder(isDarkMode)}`,
                  marginTop: "4px",
                }}
              >
                <SearchOutlined style={{ marginRight: "8px" }} />
                Xem tất cả kết quả cho "{searchValue}"
              </div>
            ),
            options: [],
          },
        ]
      : []),
  ];

  return (
    <Header
      className="glass-effect"
      style={{
        position: "fixed",
        zIndex: 1010,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--container-padding)",
        height: "70px",
        lineHeight: "70px",
      }}
    >
      <Space size="middle">
        <div className="mobile-only" onClick={() => setIsMobileMenuOpen(true)}>
          <MenuOutlined
            style={{
              fontSize: "20px",
              color: "var(--text-main)",
              cursor: "pointer",
            }}
          />
        </div>
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          TECH NOVA
        </div>
      </Space>

      {/* Ô tìm kiếm trung tâm */}
      <div
        className="desktop-only"
        style={{ flex: 1, maxWidth: "500px", margin: "0 40px" }}
      >
        <Select
          showSearch
          searchValue={searchValue}
          autoClearSearchValue={false}
          value={null}
          placeholder="Tìm kiếm sản phẩm..."
          defaultActiveFirstOption={false}
          suffixIcon={
            <SearchOutlined
              onClick={() => goToSearchPage(searchValue)}
              style={{
                color: "var(--primary-color)",
                fontSize: "18px",
                cursor: "pointer",
              }}
            />
          }
          filterOption={false}
          onSearch={handleSearch}
          onSelect={(val: string | number | null) => {
            if (val) onSelectProduct(val);
          }}
          onInputKeyDown={(e) => {
            if (e.key === "Enter" && searchValue) goToSearchPage(searchValue);
          }}
          options={searchOptions}
          loading={isSearching}
          notFoundContent={searchValue ? "Không tìm thấy" : null}
          dropdownStyle={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--glass-border)",
            padding: "8px",
            backdropFilter: "blur(10px)",
          }}
          style={{ width: "100%" }}
          className="premium-search-input"
        />
      </div>

      <Space size="large" align="center">
        <Tooltip
          title={
            isDarkMode
              ? "Chuyển sang giao diện sáng"
              : "Chuyển sang giao diện tối"
          }
        >
          <div
            onClick={onToggleTheme}
            style={{
              ...ICON_WRAPPER_STYLE,
              backgroundColor: "var(--glass-border)",
            }}
          >
            {isDarkMode ? (
              <SunOutlined style={{ fontSize: "20px", color: "#fbbf24" }} />
            ) : (
              <MoonOutlined style={{ fontSize: "20px", color: "#6366f1" }} />
            )}
          </div>
        </Tooltip>

        {user && (
          <>
            <NavIconBadge
              count={wishlistItems.length}
              color="#f43f5e"
              icon={
                <HeartOutlined
                  style={{ fontSize: "22px", color: "var(--text-main)" }}
                />
              }
              onClick={() => navigate("/wishlist")}
              title="Danh sách yêu thích"
            />
            {user.role === "ADMIN" && (
              <NavIconBadge
                count={chatUnread}
                color="#6366f1"
                icon={
                  <MessageOutlined
                    style={{ fontSize: "22px", color: "var(--text-main)" }}
                  />
                }
                onClick={() => navigate("/admin#chat")}
                title="Tin nhắn hỗ trợ"
              />
            )}
            <Tooltip title="Thông báo">
              <Dropdown
                dropdownRender={() => notificationMenu}
                placement="bottomRight"
                trigger={["click"]}
                arrow
              >
                <div style={ICON_WRAPPER_STYLE}>
                  <Badge
                    count={unreadCount}
                    size="small"
                    offset={[5, 0]}
                    color="#ff4d4f"
                  >
                    <BellOutlined
                      style={{ fontSize: "22px", color: "var(--text-main)" }}
                    />
                  </Badge>
                </div>
              </Dropdown>
            </Tooltip>
            <NavIconBadge
              id="cart-icon"
              count={cartCount}
              color="#6366f1"
              icon={
                <ShoppingCartOutlined
                  style={{ fontSize: "22px", color: "var(--text-main)" }}
                />
              }
              onClick={() => navigate("/cart")}
              title="Giỏ hàng"
            />
          </>
        )}

        {user ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                src={user.avatarUrl}
                icon={!user.avatarUrl && <UserOutlined />}
                style={{ backgroundColor: "#6366f1" }}
              />
              <span
                className="desktop-only"
                style={{ color: "var(--text-main)", fontWeight: 500 }}
              >
                {user.fullName || user.username}
              </span>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <BaseButton
              type="text"
              style={{ color: themeText(isDarkMode) }}
              onClick={() => navigate("/login")}
              className="desktop-only"
            >
              Đăng Nhập
            </BaseButton>
            <BaseButton type="primary" onClick={() => navigate("/register")}>
              Đăng Ký
            </BaseButton>
          </Space>
        )}
      </Space>

      <Drawer
        title={
          <div className="logo" style={{ color: themeText(isDarkMode) }}>
            TECH NOVA
          </div>
        }
        placement="left"
        onClose={closeMobileMenu}
        open={isMobileMenuOpen}
        width={280}
        styles={{
          body: {
            backgroundColor: isDarkMode ? "#0f172a" : "#fff",
            padding: 0,
          },
          header: {
            backgroundColor: isDarkMode ? "#0f172a" : "#fff",
            borderBottom: `1px solid ${themeBorder(isDarkMode)}`,
          },
        }}
      >
        <Menu
          mode="inline"
          theme={isDarkMode ? "dark" : "light"}
          items={menuItems}
          selectedKeys={[location.pathname]}
          style={{ background: "transparent", borderRight: "none" }}
        />
      </Drawer>
    </Header>
  );
};

export default Navbar;
