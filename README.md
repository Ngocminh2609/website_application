# Tech Nova - Dự Án Full Stack Bán Hàng Công Nghệ

Chào mừng bạn đến với dự án **Tech Nova**. Đây là một ứng dụng bán hàng đầy đủ tính năng (Full Stack) được xây dựng với kiến trúc hiện đại, tập trung vào trải nghiệm người dùng cao cấp và khả năng mở rộng hệ thống linh hoạt.

---

## 🏗️ Kiến Trúc Hệ Thống

Dự án được chia thành 3 phần chính độc lập:
1.  **Backend (`BE-Application`)**: Xây dựng bằng Java Spring Boot 3.x, cung cấp RESTful API.
2.  **Frontend (`FE-Application`)**: Xây dựng bằng React + TypeScript + Vite, giao diện Glassmorphism hiện đại.
3.  **Database (`Sql`)**: Sử dụng MySQL 8+ để lưu trữ dữ liệu sản phẩm và danh mục.

---

## 🛠️ Công Nghệ Sử Dụng

### Backend
*   **Java 17 / Spring Boot 3.4.2**
*   **Spring Data JPA**: Quản lý dữ liệu qua Hibernate.
*   **MySQL Connector/J**: Kết nối DB MySQL.
*   **Lombok**: Tối ưu hóa code.
*   **Validation API**: Kiểm soát tính hợp lệ của dữ liệu đầu vào.
*   **MinIO Java Client**: Lưu trữ và quản lý tài nguyên số tập trung.
*   **Google Auth Library**: Tích hợp xác thực mạng xã hội.

### Frontend
*   **React 18 / Vite**: Build tool và thư viện UI siêu nhanh.
*   **TypeScript**: Đảm bảo an toàn kiểu dữ liệu theo chuẩn Enterprise.
*   **Vanilla CSS**: Thiết kế Custom Glassmorphism, Responsive UI.
*   **Ant Design (v5)**: Thư viện UI components doanh nghiệp.
*   **Recharts**: Biểu đồ thống kê động mạnh mẽ.

### Cloud & Infrastructure
*   **MinIO**: Private Cloud Storage lưu trữ hình ảnh sản phẩm.
*   **Google Console**: Tích hợp Google OAuth2.
*   **VNPAY Sandbox**: Môi trường giả lập thử nghiệm thanh toán trực tuyến.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Bước 1: Chuẩn bị Cơ sở dữ liệu
1.  Đảm bảo bạn đã cài đặt **MySQL Server**.
2.  Mở công cụ quản lý MySQL của bạn (MySQL Workbench, Navicat, hoặc CLI).
3.  Thực thi file script tại mục `Sql/init_db.sql` để khởi tạo cơ sở dữ liệu `website_application` và các bảng mẫu.

### Bước 2: Cấu hình và Chạy Backend
1.  Truy cập thư mục `BE-Application`.
2.  Mở file `src/main/resources/application.properties`.
3.  Cập nhật thông tin tài khoản MySQL, MinIO và VNPAY:
    ```properties
    spring.datasource.username=YOUR_USERNAME
    spring.datasource.password=YOUR_PASSWORD
    minio.url.external=http://localhost:9000
    vnp.tmnCode=YOUR_TMN_CODE
    ```
4.  Chạy ứng dụng:
    *   Sử dụng IDE (IntelliJ IDEA/Eclipse): Tìm file `BackendApplication.java` và nhấn **Run**.
    *   Sử dụng Dòng lệnh: `mvn spring-boot:run`.
    *   **Port mặc định**: `8080`.

### Bước 3: Cài đặt và Chạy Frontend
1.  Mở Terminal và truy cập vào thư mục `FE-Application`.
2.  Cài đặt các gói phụ thuộc (Dependencies):
    ```bash
    npm install
    ```
3.  Khởi chạy chế độ phát triển (Development Mode):
    ```bash
    npm run dev
    ```
4.  Truy cập địa chỉ hiển thị trên terminal (thường là `http://localhost:5173`).

---

## 📂 Danh Sách Các Chức Năng Đã Hoàn Thành

### 🛒 Trải Nghiệm Khách Hàng
*   **Trang Chủ Cao Cấp**: Banner Hero động, danh mục thông minh và hiển thị sản phẩm nổi bật.
*   **Trang Danh Sách & Lọc**: Tìm kiếm theo từ khóa và lọc sản phẩm theo Thương hiệu/Danh mục.
*   **Chi Tiết Sản Phẩm (Nâng cấp)**: Giao diện Glassmorphism sang trọng, bộ sưu tập ảnh (Gallery), bảng thông số kỹ thuật chi tiết.
*   **Giỏ Hàng (Cart)**: Quản lý số lượng, cập nhật và xóa sản phẩm thời gian thực.
*   **Thanh Toán VNPAY**: Tích hợp cổng thanh toán trực tuyến nhanh chóng, bảo mật.
*   **Đăng Nhập Google**: Xác thực người dùng qua Google OAuth2 tiện lợi.

### 🛡️ Quản Lý Admin
*   **Dashboard Tổng Quan**: Theo dõi số lượng sản phẩm, đơn hàng và tổng doanh thu thực.
*   **Quản Lý Đơn Hàng**: Cập nhật trạng thái giao hàng (Shipping, Delivered), hủy đơn hoặc xóa vĩnh viễn.
*   **Quản Lý Sản Phẩm**: Thêm/Sửa/Xóa sản phẩm, tích hợp upload ảnh trực tiếp lên MinIO.
*   **Báo Cáo & Thống Kê (Mới)**: Hệ thống biểu đồ động (Area Chart, Bar Chart) trực quan, lọc theo Ngày/Tuần/Tháng/Năm.

---

## ✍️ Lưu Ý
*   Dự án sử dụng **UTF-8** cho toàn bộ hệ thống.
*   Đã tắt tính năng tự động cập nhật Database của Hibernate để bảo vệ dữ liệu (`ddl-auto=none`).
*   Mọi chú thích code đều sử dụng tiếng Việt để thuận tiện cho quá trình học tập và phát triển.

---
*Dự án được thực hiện bởi Antigravity Team.*

---
*Dự án được thực hiện bởi Antigravity Team.*
