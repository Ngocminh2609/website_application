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

### Frontend
*   **React 18 / Vite**: Build tool và thư viện UI siêu nhanh.
*   **TypeScript**: Đảm bảo an toàn kiểu dữ liệu theo chuẩn Enterprise.
*   **Vanilla CSS**: Thiết kế Custom Glassmorphism, Responsive UI.
*   **Fetch API (Custom Client)**: Giao tiếp RESTful API.

### Database
*   **MySQL**: Cơ sở dữ liệu quan hệ mạnh mẽ.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Bước 1: Chuẩn bị Cơ sở dữ liệu
1.  Đảm bảo bạn đã cài đặt **MySQL Server**.
2.  Mở công cụ quản lý MySQL của bạn (MySQL Workbench, Navicat, hoặc CLI).
3.  Thực thi file script tài mục `Sql/init_db.sql` để khởi tạo cơ sở dữ liệu `website_application` và các bảng mẫu.

### Bước 2: Cấu hình và Chạy Backend
1.  Truy cập thư mục `BE-Application`.
2.  Mở file `src/main/resources/application.properties`.
3.  Cập nhật thông tin tài khoản MySQL của bạn:
    ```properties
    spring.datasource.username=YOUR_USERNAME
    spring.datasource.password=YOUR_PASSWORD
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
*   **Giao diện**: Home Page cao cấp, Hero section, Grid hiển thị sản phẩm động, Navbar & Footer.
*   **API Sản phẩm**: Lấy danh sách, xem chi tiết, tìm kiếm sản phẩm.
*   **API Danh mục**: Quản lý phân loại sản phẩm.
*   **CORS**: Đã cấu hình cho phép Frontend gọi Backend mượt mà.
*   **Validation**: Kiểm soát dữ liệu chặt chẽ ở cả FE (TypeScript) và BE (Validation API).

---

## ✍️ Lưu Ý
*   Dự án sử dụng **UTF-8** cho toàn bộ hệ thống.
*   Đã tắt tính năng tự động cập nhật Database của Hibernate để bảo vệ dữ liệu (`ddl-auto=none`).
*   Mọi chú thích code đều sử dụng tiếng Việt để thuận tiện cho quá trình học tập và phát triển.

---
*Dự án được thực hiện bởi Antigravity Team.*
