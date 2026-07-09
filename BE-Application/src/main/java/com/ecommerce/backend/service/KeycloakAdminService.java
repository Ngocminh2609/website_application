package com.ecommerce.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Service gọi Keycloak Admin REST API để tạo / quản lý người dùng trong realm.
 * Dùng client_credentials flow (service account) để lấy admin token.
 */
@Slf4j
@Service
public class KeycloakAdminService {

    @Value("${keycloak.admin.url:http://localhost:8180}")
    private String keycloakUrl;

    @Value("${keycloak.admin.realm:ecommerce}")
    private String realm;

    @Value("${keycloak.admin.username:admin}")
    private String adminUsername;

    @Value("${keycloak.admin.password:admin_password}")
    private String adminPassword;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Lấy admin access token từ Keycloak bằng admin account của realm master.
     * Dùng Password Grant trên realm master để có đủ quyền quản trị toàn bộ realm.
     */
    private String getAdminToken() {
        // Admin token luôn lấy từ realm "master", không phải realm ứng dụng
        String tokenUrl = keycloakUrl + "/realms/master/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "password");
        params.add("client_id", "admin-cli");
        params.add("username", adminUsername);
        params.add("password", adminPassword);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<?> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<?, ?> body = (Map<?, ?>) response.getBody();
                return (String) body.get("access_token");
            }
        } catch (Exception e) {
            log.error("Không thể lấy admin token từ Keycloak: {}", e.getMessage());
        }
        throw new RuntimeException("Không thể xác thực với Keycloak Admin API");
    }

    /**
     * Tạo người dùng mới trong Keycloak realm.
     */
    public void createUser(String username, String email, String fullName, String password) {
        String adminToken = getAdminToken();
        String createUserUrl = keycloakUrl + "/admin/realms/" + realm + "/users";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);

        // Tách fullName thành firstName và lastName
        String[] nameParts = (fullName != null && !fullName.isBlank())
                ? fullName.split(" ", 2)
                : new String[]{ username, "" };
        String firstName = nameParts[0];
        String lastName  = nameParts.length > 1 ? nameParts[1] : "";

        Map<String, Object> userRepresentation = Map.of(
            "username",   username,
            "email",      email,
            "firstName",  firstName,
            "lastName",   lastName,
            "enabled",    true,
            "credentials", List.of(Map.of(
                "type",      "password",
                "value",     password,
                "temporary", false
            ))
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(userRepresentation, headers);

        try {
            ResponseEntity<Void> response = restTemplate.postForEntity(createUserUrl, request, Void.class);
            if (response.getStatusCode() == HttpStatus.CREATED) {
                log.info("Đã tạo user '{}' trong Keycloak thành công.", username);
                return;
            }
            log.error("Keycloak trả về HTTP {}", response.getStatusCode());
            throw new RuntimeException("Keycloak từ chối tạo user. Mã lỗi: " + response.getStatusCode());
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            String body = e.getResponseBodyAsString();
            log.error("Lỗi khi tạo user trong Keycloak: {} — {}", e.getStatusCode(), body);
            if (e.getStatusCode() == HttpStatus.CONFLICT) {
                throw new RuntimeException("Tên đăng nhập hoặc email đã tồn tại trong hệ thống.");
            }
            throw new RuntimeException("Lỗi khi tạo tài khoản: " + body);
        }
    }
}
