# 🛡️ Security Upgrade Plan — BE-Application (E-commerce)

> **Workspace:** `c:\SourceCode\My_Project\Website_Application`
> **Tạo ngày:** 2026-07-01
> **Trạng thái:** Phase 0 ✅ DONE | Phase 1 ✅ DONE | Phase 2 ✅ DONE | Phase 3 ✅ DONE | Phase 4 ✅ DONE | Phase 5-Step1 ✅ DONE | Phase 5-Rem 🔲 TODO

---

## 📋 Bối Cảnh Dự Án

### Stack Hiện Tại
- **Backend:** Spring Boot 3.4.2 (Java 21) — **Monolith**
- **Database:** MySQL
- **Auth:** Custom JWT (`jjwt 0.11.5`)
- **Storage:** MinIO / Backblaze B2
- **Payment:** VNPay
- **Frontend:** React + Vite (`http://localhost:5173`)
- **Backend port:** `http://localhost:8080`

### Kiến Trúc Mục Tiêu
```
Internet
    │
    ▼
Cloudflare (DDoS + WAF + SSL)       ← Phase 6 [khi deploy production]
    │
    ▼
NGINX (Reverse Proxy)               ← Phase 6 [khi deploy production]
    │
    ▼
Spring Cloud Gateway :8080          ← Phase 3
    │
    ▼
Keycloak :8180 (Self-hosted Docker) ← Phase 2
    │
    ▼
Spring Security (Resource Server)   ← Phase 4
    │
    ▼
Microservices (7 services)          ← Phase 5
    │
    ▼
MySQL / MinIO
```

---

## ✅ Phase 0: P0 Critical Fixes — ĐÃ HOÀN THÀNH

| File | Thay Đổi | Status |
|------|---------|--------|
| `security/JwtService.java` | `SECRET_KEY` hardcode → `@Value("${jwt.secret-key}")` | ✅ |
| `resources/application.properties` | Xóa toàn bộ hardcoded credentials → require env vars | ✅ |
| `config/WebConfig.java` | `allowedOrigins("*")` → `CorsConfigurationSource` bean với specific origins | ✅ |
| `security/SecurityConfig.java` | `Customizer.withDefaults()` → inject `CorsConfigurationSource` bean tường minh | ✅ |
| `.env` | [NEW] Credentials thật cho local (gitignored) | ✅ |
| `.env.example` | [NEW] Template cho team members | ✅ |
| `.gitignore` | [NEW] Đảm bảo `.env` không commit git | ✅ |
| `pom.xml` | Thêm `spring-dotenv 4.0.0` — auto-load `.env` | ✅ |
| `FE: LoginPage.tsx` | Xóa `useOneTap` — gây 403 do browser block third-party cookies | ✅ |

### Cách Chạy App Hiện Tại
```bash
# BE — tự động đọc .env nhờ spring-dotenv
cd BE-Application && mvn spring-boot:run

# FE
cd FE-Application && npm run dev
```

### Lưu Ý Quan Trọng — CORS Fix
WebConfig.java đã được chuyển từ `WebMvcConfigurer` → `CorsConfigurationSource @Bean`.
Spring Security 6.x cần inject bean tường minh vào SecurityConfig, không dùng `Customizer.withDefaults()`.

---

## ✅ Phase 1: Docker Infrastructure — DONE

### File: `Website_Application/docker-compose.yml`

Services đã tạo:
- `mysql:8.4` — port 3306 | volume: `website_mysql_data`
- `minio/minio` — port 9000 (API) + 9001 (console) | volume: `website_minio_data`
- `redis:7-alpine` — port 6379 | maxmemory 256mb | volume: `website_redis_data`
- `postgres:16-alpine` — port 5432 | Keycloak DB | volume: `website_postgres_kc_data`
- `quay.io/keycloak/keycloak:24.0.3` — port 8180 (map → 8080 internal)

### Biến .env đã thêm
```properties
MYSQL_ROOT_PASSWORD=ngocminh2609
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_local_password
KC_DB_USER=keycloak_user
KC_DB_PASSWORD=keycloak_db_password
KC_ADMIN_PASSWORD=admin_password
```

### Lệnh khởi động (chạy từ `Website_Application/`)
```bash
# Khởi động tất cả services
docker-compose up -d

# Kiểm tra trạng thái
docker-compose ps

# Xem logs nếu có lỗi
docker-compose logs -f keycloak

# Verify Keycloak: http://localhost:8180/admin (admin / admin_password)
# Verify MinIO Console: http://localhost:9001 (admin / 12345678)
# Verify Redis: docker exec -it website_redis redis-cli -a redis_local_password ping
```

> ⚠️ **Ghi chú Redis:** Redis chạy hoàn toàn local trong Docker — **không cần đăng ký tài khoản** hay dịch vụ cloud nào.

---

## 🔲 Phase 2: Keycloak Configuration — TODO

### Cấu hình trong Keycloak Admin Console (http://localhost:8180/admin)

1. **Realm:** `ecommerce`
2. **Client:** `ecommerce-backend` (confidential, OpenID Connect)
   - Valid redirect URIs: `http://localhost:5173/*`
   - Web origins: `http://localhost:5173`
3. **Roles:** `USER`, `ADMIN`, `MODERATOR`
4. **Client Scope:** roles mapper → claim `realm_access.roles`
5. **Google Identity Provider:**
   - Client ID: `1051116450325-qneacpielnd6acgajc3kftfpk9nkjkqj.apps.googleusercontent.com`
   - Client Secret: [lấy từ Google Cloud Console]
6. **Token Settings:**
   - Access Token: 5 phút
   - Refresh Token rotation: ON

---

## 🔲 Phase 3: Spring Cloud Gateway Module — TODO

### [NEW] Module `api-gateway/` — Port 8080

Key dependencies:
- `spring-cloud-starter-gateway`
- `spring-boot-starter-data-redis-reactive`
- `spring-cloud-starter-circuitbreaker-reactor-resilience4j`
- `spring-boot-starter-oauth2-resource-server`

### Route Map
| Route Pattern | → Service | Port |
|---------------|-----------|------|
| `/api/auth/**`, `/api/users/**` | user-service | 8081 |
| `/api/products/**`, `/api/categories/**`, `/api/banners/**`, `/api/reviews/**` | product-service | 8082 |
| `/api/orders/**`, `/api/cart/**`, `/api/wishlist/**`, `/api/coupons/**` | order-service | 8083 |
| `/api/payment/**` | payment-service | 8084 |
| `/api/notifications/**`, `/api/chat/**`, `/ws-chat/**` | notification-service | 8085 |
| `/api/files/**` | file-service | 8086 |
| `/api/admin/**`, `/api/statistics/**` | admin-service | 8087 |

### Rate Limiting (Redis)
- `/api/auth/**` → 5 req/s, burst 10
- `/api/products/**` → 50 req/s, burst 100
- Default → 20 req/s, burst 50

---

## 🔲 Phase 4: Spring Security → OAuth2 Resource Server — TODO

### Thay Đổi pom.xml
```xml
<!-- THÊM -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>

<!-- XÓA (sau khi Keycloak hoạt động) -->
<!-- io.jsonwebtoken:jjwt-api/impl/jackson -->
<!-- com.google.api-client:google-api-client -->
```

### Files Sẽ XÓA Sau Migration
- `security/JwtService.java`
- `security/JwtAuthenticationFilter.java`
- `security/ApplicationConfig.java`
- `controller/AuthController.java`
- `service/AuthService.java`

### Cấu Hình SecurityConfig.java
```java
.oauth2ResourceServer(oauth2 -> oauth2
    .jwt(jwt -> jwt.jwtAuthenticationConverter(keycloakJwtConverter()))
)
```

```java
// Keycloak JWT converter — đọc roles từ realm_access.roles
JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();
converter.setAuthoritiesClaimName("realm_access.roles");
converter.setAuthorityPrefix("ROLE_");
```

### Thêm application.properties
```properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8180/realms/ecommerce
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:8180/realms/ecommerce/protocol/openid-connect/certs
```

---

## 🔲 Phase 5: Microservices Split — TODO (Long-term)

### 7 Services từ Monolith (20 Controllers, 16 Entities)

| Service | Port | Entities | Controllers |
|---------|------|----------|-------------|
| `user-service` | 8081 | User, UserAddress | AuthCtrl, UserCtrl, UserAddressCtrl |
| `product-service` | 8082 | Product, Category, Banner, ProductReview, UserProductView | ProductCtrl, CategoryCtrl, BannerCtrl, ReviewCtrl, RecommendationCtrl, ProductViewerCtrl |
| `order-service` | 8083 | Order, OrderItem, Cart, CartItem, Wishlist, Coupon | OrderCtrl, CartCtrl, WishlistCtrl, CouponCtrl |
| `payment-service` | 8084 | PaymentTransaction | PaymentCtrl |
| `notification-service` | 8085 | Notification, ChatMessageEntity | NotificationCtrl, ChatCtrl, ChatRestCtrl |
| `file-service` | 8086 | — | FileUploadCtrl, FileProxyCtrl |
| `admin-service` | 8087 | — | StatisticsCtrl |

### Thứ Tự Tách (Ít rủi ro → Nhiều rủi ro)
1. `file-service` — Không có dependency nội bộ
2. `notification-service` — Ít dependency
3. `product-service` — Read-heavy, dễ tách
4. `user-service` — Tách trước order-service
5. `order-service` — Phụ thuộc user + product
6. `payment-service` — Phụ thuộc order
7. `admin-service` — Aggregate từ tất cả

### Project Structure Mới
```
Website_Application/
├── api-gateway/
├── common-lib/           ← DTOs, exceptions dùng chung
├── user-service/
├── product-service/
├── order-service/
├── payment-service/
├── notification-service/
├── file-service/
├── admin-service/
├── BE-Application/       ← Monolith cũ (xóa dần)
├── FE-Application/
└── docker-compose.yml
```

---

## 🔲 Phase 6: NGINX + Cloudflare — TODO (Production Only)

### NGINX
- SSL termination với Cloudflare Origin Certificate
- Rate limiting: `limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m`
- Chỉ cho Cloudflare IP ranges, block direct access
- Security headers: X-Frame-Options, HSTS, X-Content-Type-Options

### Cloudflare
- SSL Mode: Full (Strict)
- WAF: Cloudflare Managed + OWASP Core Ruleset
- Rate Limiting: `/api/auth/login` max 10 req/min per IP
- Bot Fight Mode: ON

---

## ⚠️ Known Issues

### Log Warning (Bỏ Qua)
```
WARN: Global AuthenticationManager configured with AuthenticationProvider bean.
```
→ Biến mất sau Phase 4

### Google OAuth
- `gsi/status` 403 đã fix (xóa `useOneTap`)
- Google Cloud Console: thêm `http://localhost:5173` vào Authorized JavaScript Origins

---

## 🎯 Checklist Tổng Thể

- [x] Phase 0: P0 Critical Fixes
- [x] Phase 1: Docker Compose (MySQL + MinIO + Redis + Keycloak)
- [x] Phase 2: Keycloak Realm + Client + Google IdP
- [x] Phase 3: Spring Cloud Gateway module
- [x] Phase 4: Spring Security → Keycloak Resource Server
- [/] Phase 5: Tách 7 Microservices (Step 1: file-service extracted ✅)
- [ ] Phase 6: NGINX + Cloudflare (production)

---

## 💡 Ghi Chú Cho Phiên Chat Tiếp Theo

> Nói với AI: "Tôi đang nâng cấp bảo mật cho BE Spring Boot e-commerce.
> Phase 0 đã xong. Đọc file `BE-Application/security-upgrade-plan.md` và tiếp tục **[Phase X]**."
