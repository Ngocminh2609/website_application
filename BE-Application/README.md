# Ecommerce Backend - Spring Boot

Hệ thống Backend cho dự án Full Stack Website bán hàng, được xây dựng trên nền tảng Spring Boot 3.x mạnh mẽ và linh hoạt.

## Công nghệ sử dụng
- **Java 17**: Phiên bản LTS được hỗ trợ ổn định.
- **Spring Boot 3.4.2**: Framework hiện đại nhất cho phát triển microservices và web application.
- **Spring Data JPA**: Quản lý truy xuất dữ liệu một cách trực quan và hiệu quả qua Hibernate.
- **MySQL Connector/J**: Kết nối ổn định với cơ sở dữ liệu MySQL.
- **Lombok**: Giảm thiểu code "boilerplate" (getter, setter, constructor).
- **Validation API**: Ràng buộc dữ liệu chặt chẽ ngay từ tầng Controller.

## Cấu trúc dự án
Dự án tuân thủ cấu trúc Layered Architecture truyền thống để đảm bảo tính dễ bảo trì:
- `entity`: Định nghĩa các bảng trong cơ sở dữ liệu.
- `repository`: Giao tiếp với DB thông qua JpaRepository.
- `service`: Chứa logic nghiệp vụ xử lý dữ liệu.
- `controller`: Tiếp nhận các request HTTP và phản hồi API.
- `exception`: Tập trung xử lý các lỗi xảy ra trong hệ thống.

## Các chức năng chính (Full CRUD)

### 1. Quản lý Danh mục (Categories)
- `GET /api/categories`: Lấy danh sách tất cả các danh mục.
- `GET /api/categories/{id}`: Xem chi tiết một danh mục.
- `POST /api/categories`: Tạo danh mục mới.
- `PUT /api/categories/{id}`: Cập nhật thông tin danh mục.
- `DELETE /api/categories/{id}`: Xóa danh mục (lưu ý: sẽ xóa các sản phẩm thuộc danh mục đó do cấu hình Cascade).

### 2. Quản lý Sản phẩm (Products)
- `GET /api/products`: Lấy toàn bộ danh sách sản phẩm.
- `GET /api/products/{id}`: Xem chi tiết sản phẩm.
- `GET /api/products/category/{categoryId}`: Lọc sản phẩm theo danh mục.
- `GET /api/products/search?query=...`: Tìm kiếm sản phẩm theo tên.
- `POST /api/products`: Thêm mới sản phẩm vào kho hàng.
- `PUT /api/products/{id}`: Cập nhật thông tin sản phẩm (giá, số lượng, mô tả...).
- `DELETE /api/products/{id}`: Xóa sản phẩm khỏi hệ thống.

## Hướng dẫn cài đặt và chạy
1. **Yêu cầu**: Cài đặt JDK 17+ và MySQL.
2. **Cấu hình DB**: Tạo database tên `ecommerce_db` trong MySQL hoặc để Spring Boot tự tạo.
3. **Chỉnh sửa**: Cập nhật username/password của MySQL trong `src/main/resources/application.properties`.
4. **Chạy ứng dụng**: Sử dụng IDE (IntelliJ, Eclipse) hoặc chạy lệnh `mvn spring-boot:run`.

## Quy tắc phát triển
- Luôn sử dụng tiếng Việt trong code comment để giải thích "tại sao" một đoạn mã được viết như vậy.
- Đảm bảo dữ liệu được Validate trước khi lưu xuống Database.
- Sử dụng `@RestControllerAdvice` để phản hồi lỗi nhất quán cho ứng dụng FrontEnd.
