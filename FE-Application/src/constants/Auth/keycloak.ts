const KEYCLOAK_BASE_URL = "http://localhost:8180";
const KEYCLOAK_REALM = "ecommerce";

/**
 * Cấu hình Keycloak dùng chung cho authApi và apiClient refresh token.
 */
export const KEYCLOAK_CONFIG = {
  baseUrl: KEYCLOAK_BASE_URL,
  realm: KEYCLOAK_REALM,
  clientId: "ecommerce-backend",
  clientSecret: "ecommerce-backend-secret-placeholder",
  redirectUri: "http://localhost:5173",
  tokenUrl: `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
  authUrl: `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth`,
};
