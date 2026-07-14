export const UTILS_STRINGS = {
  notification: {
    successTitle: "Thành công",
    successMsg: "Thao tác thành công!",
    errorTitle: "Lỗi hệ thống",
    errorMsg: "Đã có lỗi xảy ra, vui lòng thử lại sau.",
    infoTitle: "Thông tin",
    warningTitle: "Cảnh báo",
    auth: {
      loginSuccess: "Chào mừng bạn quay trở lại với Tech Nova!",
      loginError: "Tên đăng nhập hoặc mật khẩu không chính xác.",
      registerSuccess: "Tài khoản của bạn đã được tạo thành công!",
      registerError: "Không thể tạo tài khoản. Vui lòng kiểm tra lại thông tin hoặc thử một email khác.",
      logoutSuccess: "Bạn đã đăng xuất khỏi hệ thống.",
    },
    product: {
      addCartSuccess: "Đã thêm sản phẩm vào giỏ hàng thành công!",
      loadError: "Không thể tải danh sách sản phẩm lúc này.",
    },
  },
  url: {
    warnApiUrlUndefined: "CẢNH BÁO: VITE_API_URL không được định nghĩa, sử dụng fallback localhost",
    fallbackApiUrl: "http://localhost:8080/api",
    fallbackStorageUrl: "http://localhost:9000",
  },
};

export const TRACKING_KEYS = {
  RECENTLY_VIEWED_KEY: "tech_nova_recently_viewed",
  CATEGORY_INTEREST_KEY: "tech_nova_category_interests",
  MAX_RECENT_ITEMS: 12,
};
