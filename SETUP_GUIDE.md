# Hướng Dẫn Cài Đặt Chi Tiết - Tech Nova

Tài liệu này hướng dẫn từng bước cài đặt và cấu hình toàn bộ dự án **Tech Nova** trên môi trường phát triển cục bộ (local development).

---

## Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo máy tính đã cài đặt đầy đủ các công cụ sau:

| Công cụ | Phiên bản tối thiểu | Mục đích |
|---|---|---|
| Java JDK | 23 | Chạy Spring Boot Backend |
| Apache Maven | 3.9+ | Quản lý dependency và build BE |
| Node.js | 18.x trở lên | Chạy Vite + React Frontend |
| npm | 9.x trở lên | Quản lý package FE (đi kèm Node.js) |
| MySQL Server | 8.0+ | Cơ sở dữ liệu quan hệ |
| MinIO | Bản mới nhất | Object storage ảnh sản phẩm (local) |
| Git | Bất kỳ | Clone repository |
| IntelliJ IDEA (tùy chọn) | Community/Ultimate | IDE để chạy và debug BE |

---

## Phần 1 - Cài Đặt Cơ Sở Dữ Liệu (MySQL)

### 1.1 Cài Đặt MySQL Server

Tải MySQL Server 8.0+ tại địa chỉ: https://dev.mysql.com/downloads/mysql/

Trong quá trình cài đặt, hãy ghi nhớ:
- **Root password** (hoặc tài khoản user bạn tạo).
- **Port mặc định**: `3306`.

### 1.2 Khởi Tạo Database

Mở công cụ quản lý MySQL (MySQL Workbench, Navicat, DBeaver, hoặc MySQL CLI) rồi chạy toàn bộ nội dung file:

```
Sql/init_db.sql
```

Script này sẽ thực hiện lần lượt:

1. Tạo database `ecommerce_db` với charset `utf8mb4`.
2. Tạo 10 bảng: `categories`, `products`, `users`, `carts`, `cart_items`, `orders`, `order_items`, `payment_transactions`, `notifications`, `chat_messages`.
3. Chèn dữ liệu mẫu gồm:
   - 2 tài khoản người dùng (admin và user1, mật khẩu mặc định: `password123`).
   - 3 danh mục: Laptop, SmartPhone, SmartWatch.
   - 7 sản phẩm mẫu từ các thương hiệu Apple, Samsung, Dell, Asus.
   - 2 thông báo mẫu.

**Kiểm tra thành công**: Sau khi chạy, database `ecommerce_db` phải tồn tại với đầy đủ 10 bảng.

---

## Phần 2 - Cài Đặt Object Storage (MinIO)

MinIO được dùng để lưu trữ ảnh sản phẩm trên môi trường local. Trên production, hệ thống sử dụng Backblaze B2 (S3-compatible).

### 2.1 Tải và Chạy MinIO

Tải MinIO tại: https://min.io/download

Khởi chạy MinIO server (ví dụ trên Windows):

```
minio.exe server C:\minio-data --console-address ":9001"
```

MinIO sẽ khởi chạy với:
- **API endpoint**: `http://localhost:9000`
- **Web Console**: `http://localhost:9001`
- **Access Key mặc định**: `minioadmin`
- **Secret Key mặc định**: `minioadmin`

### 2.2 Tạo Bucket

1. Truy cập MinIO Console tại `http://localhost:9001`.
2. Đăng nhập bằng `minioadmin / minioadmin`.
3. Tạo một bucket mới, đặt tên là `ecommerce-bucket` (hoặc tên tùy chỉnh - phải khớp với cấu hình `application.properties`).
4. Đặt policy của bucket là **Public** (để ảnh sản phẩm có thể truy cập công khai).

---

## Phần 3 - Cài Đặt và Cấu Hình Backend (BE-Application)

### 3.1 Yêu Cầu

- **Java 23** đã được cài và biến môi trường `JAVA_HOME` trỏ đúng.
- **Maven 3.9+** đã được cài và có thể chạy lệnh `mvn`.

Kiểm tra bằng lệnh:
```
java -version
mvn -version
```

### 3.2 Cấu Hình `application.properties`

Mở file:
```
BE-Application/src/main/resources/application.properties
```

Cập nhật các giá trị theo môi trường của bạn:

```properties
# --- Cấu hình kết nối MySQL ---
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# --- Cấu hình Hibernate ---
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false

# --- Cấu hình MinIO / S3 Storage ---
# Dùng cho môi trường local với MinIO
minio.endpoint=http://localhost:9000
minio.access-key=minioadmin
minio.secret-key=minioadmin
minio.bucket-name=ecommerce-bucket
minio.region=us-east-1
# URL public truy cập ảnh (MinIO local)
minio.url.external=http://localhost:9000

# --- Cấu hình JWT ---
jwt.secret=YOUR_JWT_SECRET_KEY_MINIMUM_256_BITS
jwt.expiration=86400000

# --- Cấu hình Google OAuth2 ---
google.client-id=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com

# --- Cấu hình VNPay Sandbox ---
vnp.payUrl=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnp.returnUrl=http://localhost:5173/payment-success
vnp.tmnCode=YOUR_TMN_CODE
vnp.hashSecret=YOUR_HASH_SECRET

# --- Cấu hình upload file ---
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

**Giải thích các biến quan trọng:**

| Biến | Mô tả |
|---|---|
| `spring.datasource.username/password` | Thông tin đăng nhập MySQL |
| `minio.endpoint` | Địa chỉ MinIO Server |
| `minio.bucket-name` | Tên bucket đã tạo ở bước 2.2 |
| `minio.url.external` | URL public để FE truy cập ảnh |
| `jwt.secret` | Khóa bí mật ký JWT, phải đủ 256 bit |
| `google.client-id` | Client ID từ Google Cloud Console |
| `vnp.tmnCode` | Mã merchant từ VNPay Sandbox |
| `vnp.hashSecret` | Khóa bảo mật từ VNPay Sandbox |

### 3.3 Cấu Hình Google OAuth2 (Tùy chọn)

Nếu muốn bật tính năng đăng nhập Google:

1. Truy cập **Google Cloud Console**: https://console.cloud.google.com/
2. Tạo project mới (hoặc chọn project đã có).
3. Vào **APIs & Services > Credentials > Create Credentials > OAuth 2.0 Client ID**.
4. Application type: **Web application**.
5. Thêm **Authorized JavaScript origins**: `http://localhost:5173`.
6. Thêm **Authorized redirect URIs**: `http://localhost:5173`.
7. Copy **Client ID** vào `google.client-id` trong `application.properties`.
8. Copy **Client ID** vào biến `GOOGLE_CLIENT_ID` trong `FE-Application/src/App.tsx`.

### 3.4 Cấu Hình VNPay Sandbox (Tùy chọn)

Nếu muốn test chức năng thanh toán:

1. Đăng ký tài khoản tại: https://sandbox.vnpayment.vn/
2. Vào mục **Thông tin website** để lấy **TMN Code** và **Hash Secret**.
3. Điền vào `vnp.tmnCode` và `vnp.hashSecret` trong `application.properties`.
4. `vnp.returnUrl` phải trỏ về trang FE, ví dụ: `http://localhost:5173/payment-success`.

### 3.5 Chạy Backend

**Cách 1 - Dùng IDE (Khuyến nghị):**
1. Mở IntelliJ IDEA.
2. Chọn **File > Open** và trỏ đến thư mục `BE-Application`.
3. Chờ IDE tải xong Maven dependencies.
4. Tìm class `BackendApplication.java` trong `src/main/java/com/ecommerce/backend/`.
5. Nhấn nút **Run** (hoặc phím tắt `Shift+F10`).

**Cách 2 - Dùng Maven CLI:**
```
cd BE-Application
mvn spring-boot:run
```

**Cách 3 - Build JAR và chạy:**
```
cd BE-Application
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Kiểm tra thành công**: Backend đang chạy tại `http://localhost:8080`. Truy cập `http://localhost:8080/api/products` phải trả về JSON danh sách sản phẩm.

---

## Phần 4 - Cài Đặt và Cấu Hình Frontend (FE-Application)

### 4.1 Yêu Cầu

- **Node.js 18+** đã được cài và biến môi trường PATH trỏ đúng.

Kiểm tra bằng lệnh:
```
node -v
npm -v
```

### 4.2 Cấu Hình Biến Môi Trường

Trong thư mục `FE-Application`, tạo file `.env` dựa trên file mẫu `.env.example`:

```
FE-Application/.env
```

Nội dung file `.env` cho môi trường local:

```env
VITE_API_URL=http://localhost:8080/api
VITE_STORAGE_URL=http://localhost:9000
```

**Giải thích:**

| Biến | Mô tả |
|---|---|
| `VITE_API_URL` | Địa chỉ Backend API (Spring Boot) |
| `VITE_STORAGE_URL` | Địa chỉ object storage để hiển thị ảnh (MinIO local hoặc Backblaze B2) |

**Lưu ý**: File `.env` chứa thông tin nhạy cảm, đã được thêm vào `.gitignore` và không được commit lên repository.

### 4.3 Cài Đặt Dependencies

```
cd FE-Application
npm install
```

Lệnh này sẽ cài đặt toàn bộ các thư viện trong `package.json`, bao gồm:

- `react`, `react-dom` - Core UI framework
- `react-router-dom` - Client-side routing
- `antd`, `@ant-design/icons` - Component library
- `recharts` - Thư viện biểu đồ
- `@react-oauth/google` - Google OAuth2 client
- `@stomp/stompjs`, `sockjs-client` - WebSocket client (STOMP over SockJS)
- `typescript`, `vite`, `@vitejs/plugin-react` - Build tools

### 4.4 Khởi Chạy Development Server

```
cd FE-Application
npm run dev
```

**Kiểm tra thành công**: FE đang chạy tại `http://localhost:5173`. Truy cập địa chỉ này trên trình duyệt phải thấy trang chủ Tech Nova.

**Các lệnh khác:**

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | Chạy development server với hot-reload |
| `npm run build` | Build production bundle ra thư mục `dist/` |
| `npm run preview` | Preview bản build production tại local |
| `npm run lint` | Kiểm tra lỗi code với ESLint |

---

## Phần 5 - Tích Hợp WebSocket (Tự động)

Không cần cấu hình thêm. Sau khi cả BE và FE đều chạy:

- FE sẽ tự động kết nối đến WebSocket Server tại endpoint `/ws-chat` thông qua SockJS/STOMP.
- **Prefix topic nhận tin**: `/topic/...`
- **Prefix gửi tin lên server**: `/app/...`
- Chức năng chat giữa client và admin, và thông báo realtime đều hoạt động qua kết nối này.

---

## Phần 6 - Triển Khai Production (Tham Khảo)

### Backend - Docker + Render

Dockerfile đã được chuẩn bị sẵn trong `BE-Application/Dockerfile`. Quy trình build gồm 2 stage:

1. **Build stage**: Dùng `maven:3.9.9-amazoncorretto-23` để compile và đóng gói JAR.
2. **Runtime stage**: Dùng `amazoncorretto:23-alpine` gọn nhẹ để chạy JAR.

Để build và chạy Docker container:
```
cd BE-Application
docker build -t technova-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_DB_HOST:3306/ecommerce_db \
  -e SPRING_DATASOURCE_USERNAME=... \
  -e SPRING_DATASOURCE_PASSWORD=... \
  -e MINIO_ENDPOINT=https://s3.us-east-005.backblazeb2.com \
  -e MINIO_ACCESS_KEY=... \
  -e MINIO_SECRET_KEY=... \
  technova-backend
```

Trên Render, các biến môi trường được cấu hình trong phần **Environment Variables** của service.

### Frontend - Vercel

File `vercel.json` trong `FE-Application` đã có cấu hình SPA rewrite:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Cấu hình này đảm bảo React Router hoạt động đúng khi người dùng truy cập trực tiếp vào các route như `/product/1` hay `/admin`.

Trên Vercel, cấu hình các biến môi trường production:

```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_STORAGE_URL=https://s3.us-east-005.backblazeb2.com
```

### Storage - Backblaze B2 Production

Thay thế cấu hình MinIO trong `application.properties` (hoặc biến môi trường Docker) bằng thông tin Backblaze B2:

```properties
minio.endpoint=https://s3.us-east-005.backblazeb2.com
minio.access-key=YOUR_B2_KEY_ID
minio.secret-key=YOUR_B2_APPLICATION_KEY
minio.bucket-name=YOUR_B2_BUCKET_NAME
minio.region=us-east-005
minio.url.external=https://YOUR_B2_BUCKET_NAME.s3.us-east-005.backblazeb2.com
```

---

## Tài Khoản Mẫu Sau Khi Khởi Tạo Database

| Tài khoản | Mật khẩu | Vai trò |
|---|---|---|
| `admin` | `password123` | ADMIN - Truy cập /admin |
| `user1` | `password123` | USER - Tài khoản khách hàng |

---

## Thứ Tự Khởi Chạy Đúng

Để tránh lỗi kết nối, hãy khởi chạy theo thứ tự sau:

1. Khởi chạy **MySQL Server**.
2. Khởi chạy **MinIO Server**.
3. Chạy **Backend** (`mvn spring-boot:run` hoặc qua IDE).
4. Chạy **Frontend** (`npm run dev`).
5. Truy cập `http://localhost:5173`.

---

*Tài liệu này thuộc dự án Tech Nova - Antigravity Team.*
