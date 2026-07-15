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

import static com.ecommerce.backend.constant.service.KeycloakAdminServiceConstants.*;

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
        String tokenUrl = keycloakUrl + MASTER_TOKEN_PATH;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add(PARAM_GRANT_TYPE, GRANT_TYPE_PASSWORD);
        params.add(PARAM_CLIENT_ID, CLIENT_ID_ADMIN_CLI);
        params.add(PARAM_USERNAME, adminUsername);
        params.add(PARAM_PASSWORD, adminPassword);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<?> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<?, ?> body = (Map<?, ?>) response.getBody();
                return (String) body.get(KEY_ACCESS_TOKEN);
            }
        } catch (Exception e) {
            log.error(LOG_TOKEN_FAILED, e.getMessage());
        }
        throw new RuntimeException(ERROR_ADMIN_TOKEN);
    }

    /**
     * Tạo người dùng mới trong Keycloak realm.
     */
    public void createUser(String username, String email, String fullName, String password) {
        String adminToken = getAdminToken();
        String createUserUrl = keycloakUrl + ADMIN_REALMS_PATH_PREFIX + realm + USERS_PATH_SUFFIX;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);

        // Tách fullName thành firstName và lastName
        String[] nameParts = (fullName != null && !fullName.isBlank())
                ? fullName.split(FULL_NAME_DELIMITER, 2)
                : new String[]{username, LAST_NAME_DEFAULT};
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : LAST_NAME_DEFAULT;

        Map<String, Object> userRepresentation = Map.of(
                KEY_USERNAME, username,
                KEY_EMAIL, email,
                KEY_FIRSTNAME, firstName,
                KEY_LASTNAME, lastName,
                KEY_ENABLED, true,
                KEY_CREDENTIALS, List.of(Map.of(
                        KEY_TYPE, GRANT_TYPE_PASSWORD,
                        KEY_VALUE, password,
                        KEY_TEMPORARY, false
                ))
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(userRepresentation, headers);

        try {
            ResponseEntity<Void> response = restTemplate.postForEntity(createUserUrl, request, Void.class);
            if (response.getStatusCode() == HttpStatus.CREATED) {
                log.info(LOG_USER_CREATED, username);
                return;
            }
            log.error(LOG_KEYCLOAK_HTTP, response.getStatusCode());
            throw new RuntimeException(ERROR_KEYCLOAK_REJECT_PREFIX + response.getStatusCode());
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            String body = e.getResponseBodyAsString();
            log.error(LOG_CREATE_USER_ERROR, e.getStatusCode(), body);
            if (e.getStatusCode() == HttpStatus.CONFLICT) {
                throw new RuntimeException(ERROR_USER_CONFLICT);
            }
            throw new RuntimeException(ERROR_USER_CREATE_PREFIX + body);
        }
    }
}
