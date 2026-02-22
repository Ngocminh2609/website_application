# Hướng Dẫn Cài Đặt Siêu Tốc (Quick Start)

Dưới 100 dòng cho toàn bộ hệ thống Tech Nova.

### 1. Yêu cầu tiên quyết
- Java 23, Maven, Node.js 18+.
- MySQL Server đang chạy (Port 3306).
- MinIO đang chạy (Port 9000 - lưu ảnh local).

### 2. Khởi tạo Cơ sở dữ liệu
Chạy toàn bộ nội dung file SQL trong công cụ quản lý DB của bạn:
`Sql/init_db.sql`

### 3. Cấu hình Backend (BE-Application)
Mở `BE-Application/src/main/resources/application.properties` và cập nhật:
```properties
spring.datasource.username=root
spring.datasource.password=123456 # Mật khẩu MySQL của bạn
jwt.secret=your_super_secret_key_at_least_32_chars_long
```

### 4. Cấu hình Frontend (FE-Application)
Trong thư mục `FE-Application`, tạo file `.env`:
```env
VITE_API_URL=http://localhost:8080/api
VITE_STORAGE_URL=http://localhost:9000
```

### 5. Khởi chạy hệ thống

**Bước 1: Chạy Backend**
```powershell
cd BE-Application
mvn spring-boot:run
```

**Bước 2: Chạy Frontend**
```powershell
cd FE-Application
npm install
npm run dev
```

### 6. Thông tin đăng nhập mẫu
| Vai trò | Tài khoản | Mật khẩu |
|---|---|---|
| Admin | `admin` | `password123` |
| Khách hàng | `user1` | `password123` |

### 7. Kiểm tra tính năng PWA (Build Production)
Để test tính năng Offline và Cài đặt của PWA tại local:
```powershell
cd FE-Application
npm run build
npm run preview
```

### Lưu ý quan trọng
- **Thanh toán**: Cấu hình VNPay Sandbox trong `application.properties` để test.
- **Google Login**: Thay `GOOGLE_CLIENT_ID` trong `App.tsx` bằng ID từ Google Console.
- **Thứ tự**: Luôn chạy SQL và MinIO trước khi chạy code.

---
*Antigravity Team - Tech Nova PWA Evolution*
