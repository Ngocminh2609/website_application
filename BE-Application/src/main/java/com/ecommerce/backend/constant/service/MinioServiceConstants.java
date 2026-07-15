package com.ecommerce.backend.constant.service;

/**
 * Hằng số cấu hình MinioService.
 */
public final class MinioServiceConstants {

    private MinioServiceConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // API Path
    public static final String FILES_API_PATH_PREFIX = "/api/files/";
    public static final String PATH_SEPARATOR = "/";
    public static final String FILENAME_SEPARATOR = "_";

    // Exception & Log Messages
    public static final String ERROR_UPLOAD = "Lỗi khi tải tệp lên storage: ";
    public static final String ERROR_DELETE = "Lỗi khi xóa tệp từ storage: ";
}
