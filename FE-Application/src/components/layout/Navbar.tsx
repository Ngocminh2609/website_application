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
import { useCart } from "../../hooks/Cart/useCart";
import { productApi } from "../../api/productApi";
import { useProducts } from "../../hooks/Product/useProducts";
import type { Product } from "../../types/product";
import { useNotifications } from "../../context/NotificationContext";
import { useAdminChat } from "../../context/useAdminChat";
import { useWishlist } from "../../hooks/Wishlist/useWishlist";
import AdminChatDrawer from "../common/AdminChatDrawer";

const { Header } = Layout;
const { Text } = Typography;

import {
  ICON_WRAPPER_STYLE,
  themeBorder,
} from "../../styles/commonStyles";
import { styles } from "./styles/Navbar.styles";
import { LAYOUT_STRINGS } from "../../constants/Layout/layout";
import { ROLES } from "../common/Commons";
import { handleImgError } from "../../utils/image";
import { formatDateTimeVi } from "../../utils/format";

const { navbar: nvStrings } = LAYOUT_STRINGS;

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
  const [isAdminChatOpen, setIsAdminChatOpen] = useState(false);

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
          {nvStrings.home}
        </Link>
      ),
    },
    {
      key: "/products",
      label: (
        <Link to="/products" onClick={closeMobileMenu}>
          {nvStrings.products}
        </Link>
      ),
    },
    {
      key: "/wishlist",
      label: (
        <Link to="/wishlist" onClick={closeMobileMenu}>
          {nvStrings.wishlist}
        </Link>
      ),
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: nvStrings.profile,
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "wishlist",
      label: nvStrings.wishlistList,
      icon: <HeartOutlined />,
      onClick: () => navigate("/wishlist"),
    },
    {
      key: "orders",
      label: nvStrings.myOrders,
      icon: <ShoppingOutlined />,
      onClick: () => navigate("/orders"),
    },
    ...(user?.role === ROLES.ADMIN
      ? [
          {
            key: "admin",
            label: nvStrings.adminSystem,
            icon: <DashboardOutlined />,
            onClick: () => navigate("/admin"),
          },
        ]
      : []),
    { type: "divider" },
    {
      key: "logout",
      label: nvStrings.logout,
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
    <div style={styles.notificationMenu(isDarkMode)}>
      <div style={styles.notificationHeader(isDarkMode)}>
        <Text strong style={styles.notificationTitle(isDarkMode)}>
          {nvStrings.notifications}
        </Text>
        {unreadCount > 0 && (
          <BaseButton
            type="text"
            size="small"
            onClick={() => markAllAsRead()}
            style={styles.markAllReadBtn}
          >
            {nvStrings.markAllRead}
          </BaseButton>
        )}
      </div>
      <div style={styles.notificationListContainer}>
        {notifications.length > 0 ? (
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                onClick={() => !item.isRead && markAsRead(item.id)}
                style={styles.notificationListItem(isDarkMode, item.isRead)}
              >
                <div style={styles.notificationItemContent}>
                  <div style={styles.notificationDot(item.isRead)} />
                  <div style={{ flex: 1 }}>
                    <Text
                      style={styles.notificationMessageText(
                        isDarkMode,
                        item.isRead,
                      )}
                    >
                      {item.message}
                    </Text>
                    <Text style={styles.notificationTimeText(isDarkMode)}>
                      {formatDateTimeVi(item.createdAt)}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div style={styles.noNotificationContainer}>
            <BellOutlined style={styles.noNotificationIcon(isDarkMode)} />
            <div style={styles.noNotificationText(isDarkMode)}>
              {nvStrings.noNotifications}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const searchOptions = [
    {
      label: (
        <span style={styles.searchOptionHeader(isDarkMode)}>
          {!searchValue
            ? nvStrings.suggestionsForYou
            : nvStrings.resultsFor.replace('"{query}"', `"${searchValue}"`)}
        </span>
      ),
      options: (!searchValue
        ? bestSellers.slice(0, 5)
        : searchResults.slice(0, 8)
      ).map((product) => ({
        value: product.id,
        label: (
          <div style={styles.searchOptionItem}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={styles.searchOptionImage(isDarkMode)}
              onError={handleImgError}
            />
            <div style={styles.searchOptionInfo}>
              <div style={styles.searchOptionName(isDarkMode)}>
                {product.name}
              </div>
              <div style={styles.searchOptionPrice}>
                {product.price.toLocaleString()}đ
                {!searchValue && (
                  <FireOutlined style={styles.searchOptionFireIcon} />
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
                style={styles.viewAllResultsBtn(isDarkMode)}
              >
                <SearchOutlined style={styles.searchIconMargin} />
                {nvStrings.viewAllResultsFor.replace(
                  '"{query}"',
                  `"${searchValue}"`,
                )}
              </div>
            ),
            options: [],
          },
        ]
      : []),
  ];

  return (
    <>
    <Header className="glass-effect" style={styles.header}>
      <Space size="middle">
        <div className="mobile-only" onClick={() => setIsMobileMenuOpen(true)}>
          <MenuOutlined style={styles.mobileMenuIcon} />
        </div>
        <div className="logo" onClick={() => navigate("/")} style={styles.logo}>
          {nvStrings.logoText}
        </div>
      </Space>

      {/* Ô tìm kiếm trung tâm */}
      <div className="desktop-only" style={styles.searchContainer}>
        <Select
          showSearch
          searchValue={searchValue}
          autoClearSearchValue={false}
          value={null}
          placeholder={nvStrings.searchPlaceholder}
          defaultActiveFirstOption={false}
          suffixIcon={
            <SearchOutlined
              onClick={() => goToSearchPage(searchValue)}
              style={styles.searchIcon}
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
          notFoundContent={searchValue ? nvStrings.notFound : null}
          dropdownStyle={styles.searchDropdown}
          style={styles.searchSelect}
          className="premium-search-input"
        />
      </div>

      <Space size="large" align="center">
        <Tooltip
          title={isDarkMode ? nvStrings.switchToLight : nvStrings.switchToDark}
        >
          <div onClick={onToggleTheme} style={styles.themeToggleBtn}>
            {isDarkMode ? (
              <SunOutlined style={styles.sunIcon} />
            ) : (
              <MoonOutlined style={styles.moonIcon} />
            )}
          </div>
        </Tooltip>

        {user && (
          <>
            <NavIconBadge
              count={wishlistItems.length}
              color="#f43f5e"
              icon={<HeartOutlined style={styles.badgeIcon} />}
              onClick={() => navigate("/wishlist")}
              title={nvStrings.wishlistList}
            />
            {user.role === ROLES.ADMIN && (
              <NavIconBadge
                count={chatUnread}
                color="#6366f1"
                icon={<MessageOutlined style={styles.badgeIcon} />}
                onClick={() => setIsAdminChatOpen(true)}
                title={nvStrings.supportMessages}
              />
            )}
            <Tooltip title={nvStrings.notifications}>
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
                    <BellOutlined style={styles.badgeIcon} />
                  </Badge>
                </div>
              </Dropdown>
            </Tooltip>
            <NavIconBadge
              id="cart-icon"
              count={cartCount}
              color="#6366f1"
              icon={<ShoppingCartOutlined style={styles.badgeIcon} />}
              onClick={() => navigate("/cart")}
              title={nvStrings.cart}
            />
          </>
        )}

        {user ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space style={styles.userDropdownTrigger}>
              <Avatar
                src={user.avatarUrl}
                icon={!user.avatarUrl && <UserOutlined />}
                style={styles.avatar}
              />
              <span className="desktop-only" style={styles.userName}>
                {user.fullName || user.username}
              </span>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <BaseButton
              type="text"
              style={styles.loginBtn(isDarkMode)}
              onClick={() => navigate("/login")}
              className="desktop-only"
            >
              {nvStrings.login}
            </BaseButton>
            <BaseButton type="primary" onClick={() => navigate("/register")}>
              {nvStrings.register}
            </BaseButton>
          </Space>
        )}
      </Space>

      <Drawer
        title={
          <div className="logo" style={styles.drawerLogo(isDarkMode)}>
            {nvStrings.logoText}
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
          style={styles.drawerMenu}
        />
      </Drawer>

    </Header>

    {user?.role === ROLES.ADMIN && (
      <AdminChatDrawer
        open={isAdminChatOpen}
        onClose={() => setIsAdminChatOpen(false)}
      />
    )}
    </>
  );
};

export default Navbar;
