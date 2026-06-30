import type { CSSProperties } from 'react';


/** Ảnh fallback mặc định khi ảnh sản phẩm lỗi */
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800';

/** Style chung cho BaseInput và BaseInput.Password */
export const BASE_INPUT_STYLE: CSSProperties = {
    borderRadius: '8px'
};

/** Style wrapper căn giữa cho các icon tròn/vuông điều hướng */
export const ICON_WRAPPER_STYLE: CSSProperties = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    transition: 'all 0.3s'
};

/** Màu text chính theo dark/light mode */
export const themeText = (dark: boolean): string => (dark ? '#fff' : '#1e293b');

/** Màu border nhẹ theo dark/light mode */
export const themeBorder = (dark: boolean): string => (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)');

/** Style cho BaseButton */
export const BASE_BUTTON_STYLE: CSSProperties = {
    borderRadius: '8px',
    fontWeight: 600,
    height: 'auto',
    padding: '8px 24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
};

/** Style cho BaseSelect */
export const BASE_SELECT_STYLE: CSSProperties = {
    width: '100%',
};

/** Style cho dropdown của BaseSelect */
export const BASE_SELECT_DROPDOWN_STYLE: CSSProperties = {
    backgroundColor: '#1e293b',
};

/** Style container card của trang Login */
export const LOGIN_CARD_STYLE: CSSProperties = {
    maxWidth: '400px',
    margin: '140px auto',
    padding: '40px',
    background: 'var(--glass-bg)',
    borderRadius: '24px',
    border: '1px solid var(--glass-border)',
    backdropFilter: 'blur(15px)',
};

/** Style container card của trang Register */
export const REGISTER_CARD_STYLE: CSSProperties = {
    maxWidth: '450px',
    margin: '80px auto',
    padding: '40px',
    background: 'var(--glass-bg)',
    borderRadius: '16px',
    border: '1px solid var(--glass-border)',
    backdropFilter: 'blur(10px)',
};

/** Style card thông tin trong ProfilePage */
export const PROFILE_CARD_STYLE: CSSProperties = {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '24px',
    padding: '40px',
    backdropFilter: 'blur(10px)',
};

/** Style các trường input trong ProfilePage */
export const PROFILE_INPUT_STYLE: CSSProperties = {
    borderRadius: '10px',
    height: '46px',
};

/** Style cho container Empty của trang Wishlist */
export const WISHLIST_EMPTY_CARD_STYLE: CSSProperties = {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '24px',
    padding: '100px 60px',
    textAlign: 'center',
};

/** Style container ngoài của thanh so sánh CompareBar */
export const COMPARE_BAR_CONTAINER_STYLE: CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    maxWidth: '90vw',
};

/** Style container trong của thanh so sánh CompareBar */
export const COMPARE_BAR_CONTENT_STYLE: CSSProperties = {
    background: 'rgba(20, 20, 20, 0.85)',
    backdropFilter: 'blur(12px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    overflow: 'hidden',
};

/** Style ngoài cùng cho thẻ ProductCard */
export const PRODUCT_CARD_STYLE: CSSProperties = {
    borderRadius: '20px',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    backdropFilter: 'blur(10px)',
};

/** Style body cho thẻ ProductCard */
export const PRODUCT_CARD_BODY_STYLE: CSSProperties = {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
};

/** Style brand trong thẻ ProductCard */
export const PRODUCT_CARD_BRAND_STYLE: CSSProperties = {
    color: 'var(--primary-color)',
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
};

/** Style tiêu đề trong thẻ ProductCard */
export const PRODUCT_CARD_TITLE_STYLE: CSSProperties = {
    marginBottom: '10px',
    color: 'inherit',
    fontSize: '1.1rem',
    height: '1.4em',
    overflow: 'hidden',
    fontWeight: 600,
};

/** Style mô tả trong thẻ ProductCard */
export const PRODUCT_CARD_DESC_STYLE: CSSProperties = {
    marginBottom: '16px',
    color: 'var(--text-muted)',
    height: '3.2em',
    lineHeight: '1.6em',
    overflow: 'hidden',
    fontSize: '0.9rem',
};

/** Lấy style dropdown thông báo tùy theo chế độ màu */
export const getNavbarNotificationMenuStyle = (dark: boolean): CSSProperties => ({
    width: '350px',
    backgroundColor: dark ? '#1e293b' : '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${themeBorder(dark)}`,
    overflow: 'hidden',
});

