package com.ecommerce.backend.constant.service;

/**
 * Hằng số cấu hình KeycloakAdminService.
 */
public final class KeycloakAdminServiceConstants {

    private KeycloakAdminServiceConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Keycloak URL Paths
    public static final String MASTER_TOKEN_PATH = "/realms/master/protocol/openid-connect/token";
    public static final String ADMIN_REALMS_PATH_PREFIX = "/admin/realms/";
    public static final String USERS_PATH_SUFFIX = "/users";

    // OAuth2 Form Params
    public static final String PARAM_GRANT_TYPE = "grant_type";
    public static final String GRANT_TYPE_PASSWORD = "password";
    public static final String PARAM_CLIENT_ID = "client_id";
    public static final String CLIENT_ID_ADMIN_CLI = "admin-cli";
    public static final String PARAM_USERNAME = "username";
    public static final String PARAM_PASSWORD = "password";

    // Token Response Keys
    public static final String KEY_ACCESS_TOKEN = "access_token";

    // User Representation Keys
    public static final String KEY_USERNAME = "username";
    public static final String KEY_EMAIL = "email";
    public static final String KEY_FIRSTNAME = "firstName";
    public static final String KEY_LASTNAME = "lastName";
    public static final String KEY_ENABLED = "enabled";
    public static final String KEY_CREDENTIALS = "credentials";
    public static final String KEY_TYPE = "type";
    public static final String KEY_VALUE = "value";
    public static final String KEY_TEMPORARY = "temporary";

    // Full Name Split
    public static final String FULL_NAME_DELIMITER = " ";
    public static final String LAST_NAME_DEFAULT = "";

    // Exception Messages
    public static final String ERROR_ADMIN_TOKEN = "Không thể xác thực với Keycloak Admin API";
    public static final String ERROR_USER_CONFLICT = "Tên đăng nhập hoặc email đã tồn tại trong hệ thống.";
    public static final String ERROR_USER_CREATE_PREFIX = "Lỗi khi tạo tài khoản: ";
    public static final String ERROR_KEYCLOAK_REJECT_PREFIX = "Keycloak từ chối tạo user. Mã lỗi: ";

    // Log Messages
    public static final String LOG_TOKEN_FAILED = "Không thể lấy admin token từ Keycloak: {}";
    public static final String LOG_USER_CREATED = "Đã tạo user '{}' trong Keycloak thành công.";
    public static final String LOG_KEYCLOAK_HTTP = "Keycloak trả về HTTP {}";
    public static final String LOG_CREATE_USER_ERROR = "Lỗi khi tạo user trong Keycloak: {} — {}";
}
