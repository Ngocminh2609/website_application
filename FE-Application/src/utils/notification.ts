import { notification as antdNotification } from 'antd';

/**
 * Tiện ích thông báo tập trung (Centralized Notification).
 * Không sử dụng thông báo từ Backend trả về để đảm bảo tính thẩm mỹ và đồng bộ ngôn ngữ.
 */
export const notification = {
    // Thông báo thành công mặc định
    success: (msg: string = 'Thao tác thành công!') => {
        antdNotification.success({
            message: 'Thành công',
            description: msg,
            placement: 'topRight',
            duration: 3
        });
    },

    // Thông báo lỗi mặc định
    error: (msg: string = 'Đã có lỗi xảy ra, vui lòng thử lại sau.') => {
        antdNotification.error({
            message: 'Lỗi hệ thống',
            description: msg,
            placement: 'topRight',
            duration: 4
        });
    },

    // Thông báo thông tin
    info: (msg: string) => {
        antdNotification.info({
            message: 'Thông tin',
            description: msg,
            placement: 'topRight',
            duration: 3
        });
    },

    // Thông báo cảnh báo
    warning: (msg: string) => {
        antdNotification.warning({
            message: 'Cảnh báo',
            description: msg,
            placement: 'topRight',
            duration: 3
        });
    },

    // Các hàm helper cho từng nghiệp vụ cụ thể (DRY)
    auth: {
        loginSuccess: () => notification.success('Chào mừng bạn quay trở lại với Tech Nova!'),
        loginError: () => notification.error('Tên đăng nhập hoặc mật khẩu không chính xác.'),
        registerSuccess: () => notification.success('Tài khoản của bạn đã được tạo thành công!'),
        registerError: () => notification.error('Không thể tạo tài khoản. Vui lòng kiểm tra lại thông tin hoặc thử một email khác.'),
        logoutSuccess: () => notification.success('Bạn đã đăng xuất khỏi hệ thống.')
    },

    product: {
        addCartSuccess: () => notification.success('Đã thêm sản phẩm vào giỏ hàng thành công!'),
        loadError: () => notification.error('Không thể tải danh sách sản phẩm lúc này.')
    }
};
