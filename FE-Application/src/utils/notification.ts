import { notification as antdNotification } from "antd";
import { UTILS_STRINGS } from "../constants/Utils/utils";

/**
 * Tiện ích thông báo tập trung (Centralized Notification).
 * Không sử dụng thông báo từ Backend trả về để đảm bảo tính thẩm mỹ và đồng bộ ngôn ngữ.
 */
export const notification = {
  // Thông báo thành công mặc định
  success: (msg: string = UTILS_STRINGS.notification.successMsg) => {
    antdNotification.success({
      message: UTILS_STRINGS.notification.successTitle,
      description: msg,
      placement: "topRight",
      duration: 3,
    });
  },

  // Thông báo lỗi mặc định
  error: (msg: string = UTILS_STRINGS.notification.errorMsg) => {
    antdNotification.error({
      message: UTILS_STRINGS.notification.errorTitle,
      description: msg,
      placement: "topRight",
      duration: 4,
    });
  },

  // Thông báo thông tin
  info: (msg: string) => {
    antdNotification.info({
      message: UTILS_STRINGS.notification.infoTitle,
      description: msg,
      placement: "topRight",
      duration: 3,
    });
  },

  // Thông báo cảnh báo
  warning: (msg: string) => {
    antdNotification.warning({
      message: UTILS_STRINGS.notification.warningTitle,
      description: msg,
      placement: "topRight",
      duration: 3,
    });
  },

  // Các hàm helper cho từng nghiệp vụ cụ thể (DRY)
  auth: {
    loginSuccess: () =>
      notification.success(UTILS_STRINGS.notification.auth.loginSuccess),
    loginError: () =>
      notification.error(UTILS_STRINGS.notification.auth.loginError),
    registerSuccess: () =>
      notification.success(UTILS_STRINGS.notification.auth.registerSuccess),
    registerError: () =>
      notification.error(UTILS_STRINGS.notification.auth.registerError),
    logoutSuccess: () =>
      notification.success(UTILS_STRINGS.notification.auth.logoutSuccess),
  },

  product: {
    addCartSuccess: () =>
      notification.success(UTILS_STRINGS.notification.product.addCartSuccess),
    loadError: () =>
      notification.error(UTILS_STRINGS.notification.product.loadError),
  },

  wishlist: {
    addSuccess: () =>
      notification.success(UTILS_STRINGS.notification.wishlist.addSuccess),
    removeSuccess: () =>
      notification.success(UTILS_STRINGS.notification.wishlist.removeSuccess),
  },

  review: {
    submitSuccess: () =>
      notification.success(UTILS_STRINGS.notification.review.submitSuccess),
    deleteSuccess: () =>
      notification.success(UTILS_STRINGS.notification.review.deleteSuccess),
  },
};
