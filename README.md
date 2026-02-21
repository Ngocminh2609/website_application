# Tech Nova - Website Bán Hàng Công Nghệ Full Stack

**Tech Nova** là một ứng dụng thương mại điện tử hoàn chỉnh (Full Stack) được xây dựng theo kiến trúc microservice tách biệt Frontend và Backend. Hệ thống hỗ trợ đầy đủ vòng đời mua sắm từ duyệt sản phẩm, giỏ hàng, thanh toán trực tuyến đến quản trị đơn hàng và thống kê doanh thu theo thời gian thực.

---

## Kiến Trúc Hệ Thống

```
Project_TS_FullStack/
├── BE-Application/     # Spring Boot 3 - RESTful API + WebSocket
├── FE-Application/     # React 19 + TypeScript + Vite - Giao diện người dùng
└── Sql/                # MySQL - Script khởi tạo database và dữ liệu mẫu
```

Hệ thống giao tiếp theo mô hình:

- **Client (FE)** gọi **RESTful API** và **WebSocket (STOMP)** lên **Server (BE)**.
- **BE** xác thực bằng **JWT** và phân quyền **ROLE_USER / ROLE_ADMIN**.
- **BE** lưu trữ file ảnh lên **S3-compatible Storage** (hỗ trợ cả MinIO local và Backblaze B2 production).
- **BE** xử lý thanh toán qua cổng **VNPay** với chữ ký HMAC-SHA512.
- **FE** được triển khai trên **Vercel**, **BE** được đóng gói **Docker** và triển khai trên **Render**.

---

## Công Nghệ Sử Dụng

### Backend (`BE-Application`)

| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| Ngôn ngữ | Java | 23 |
| Framework | Spring Boot | 3.4.2 |
| ORM | Spring Data JPA + Hibernate | 6.x |
| Bảo mật | Spring Security + JJWT | 0.11.5 |
| WebSocket | Spring WebSocket + STOMP + SockJS | - |
| Xác thực Google | Google API Client | 2.0.0 |
| Lưu trữ ảnh | AWS SDK v2 S3 (tương thích MinIO & Backblaze B2) | 2.25.16 |
| Thanh toán | VNPay (HMAC-SHA512) | Sandbox |
| Database driver | MySQL Connector/J | 8.x |
| Tiện ích | Lombok | - |
| Đóng gói | Docker + Maven | - |

**Các module chính:**

- `security/` - JWT Filter, JWT Service, Spring Security Config
- `config/` - CORS, WebSocket, VNPay, S3/MinIO, Data Initializer
- `controller/` - 13 controller xử lý API: Auth, Product, Category, Cart, Order, Payment, User, Notification, Chat, Statistics, File Upload
- `service/` - 10 service chứa toàn bộ business logic
- `entity/` - 10 entity JPA mapping với database
- `dto/` - 11 DTO truyền dữ liệu giữa các tầng
- `repository/` - 9 JPA repository

### Frontend (`FE-Application`)

| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| Ngôn ngữ | TypeScript | ~5.9.3 |
| UI Framework | React | 19.x |
| Build tool | Vite | 7.x |
| Component library | Ant Design | 6.x |
| Icon | @ant-design/icons | 6.x |
| Routing | React Router DOM | 7.x |
| Biểu đồ | Recharts | 3.x |
| Google OAuth | @react-oauth/google | 0.13.x |
| WebSocket client | @stomp/stompjs + SockJS-client | 7.x / 1.6.x |
| Styling | Vanilla CSS (Glassmorphism) | - |
| Deploy | Vercel | - |

**Cấu trúc thư mục `src/`:**

```
src/
├── api/            # 10 module gọi API (apiClient, authApi, productApi, ...)
├── components/
│   ├── common/     # ProductCard, ChatWidget, BaseButton, BaseInput, BaseSelect
│   └── layout/     # Navbar, Footer
├── context/        # CartContext, ProductContext, NotificationContext, AdminChatContext
├── hooks/          # useProducts, useAdminChat
├── pages/          # 8 trang: Home, Auth, Product, Cart, Order, Payment, Profile, Admin
├── types/          # Định nghĩa TypeScript types
└── utils/          # notification helper, url helper
```

### Database (`Sql`)

| Bảng | Mục đích |
|---|---|
| `categories` | Danh mục sản phẩm |
| `products` | Sản phẩm (hỗ trợ flash sale, best seller, thông số kỹ thuật) |
| `users` | Người dùng (USER / ADMIN, tích hợp Google OAuth) |
| `carts` | Giỏ hàng (1 giỏ - 1 user) |
| `cart_items` | Chi tiết giỏ hàng |
| `orders` | Đơn hàng (PENDING, PAID, FAILED, SHIPPING, DELIVERED, CANCELLED) |
| `order_items` | Chi tiết đơn hàng (lưu giá tại thời điểm mua) |
| `payment_transactions` | Giao dịch VNPay (lưu toàn bộ payload gốc) |
| `notifications` | Thông báo hệ thống theo thời gian thực |
| `chat_messages` | Lịch sử tin nhắn chat giữa khách và admin |

Database sử dụng `utf8mb4 / utf8mb4_unicode_ci`, engine `InnoDB`, có đầy đủ index và foreign key.

### Cloud & Hạ Tầng

| Dịch vụ | Mục đích |
|---|---|
| MinIO (local) | Object storage lưu ảnh sản phẩm trong môi trường phát triển |
| Backblaze B2 (production) | S3-compatible cloud storage trên môi trường triển khai |
| Google Cloud Console | Cấp Client ID cho Google OAuth2 |
| VNPay Sandbox | Cổng thanh toán giả lập kiểm thử |
| Docker | Đóng gói BE thành container triển khai |
| Render | Hosting BE dưới dạng Docker container |
| Vercel | Hosting FE với SPA rewrite rule |

---

## Tính Năng Chi tiết

### Trang Khách Hàng

- **Trang chủ**: Banner hero động, danh mục nổi bật, Flash Sale, Best Seller, biểu ngữ thương hiệu.
- **Danh sách sản phẩm**: Tìm kiếm, lọc theo danh mục và thương hiệu, phân trang.
- **Chi tiết sản phẩm**: Gallery ảnh, thông số kỹ thuật, đánh giá, thêm vào giỏ hàng.
- **Giỏ hàng**: Thêm/xóa/cập nhật số lượng, tính tổng tiền tự động.
- **Thanh toán**: Tích hợp VNPay, xử lý callback và lưu lịch sử giao dịch.
- **Đơn hàng**: Xem lịch sử đơn hàng, trạng thái theo dõi.
- **Hồ sơ cá nhân**: Cập nhật thông tin, thay đổi mật khẩu, upload avatar.
- **Đăng nhập / Đăng ký**: Form thông thường và đăng nhập bằng Google OAuth2.
- **Chat trực tiếp**: Widget chat góc màn hình, kết nối WebSocket với admin.
- **Thông báo**: Nhận thông báo realtime qua WebSocket khi có cập nhật đơn hàng.

### Trang Quản Trị Admin

- **Dashboard**: Thống kê tổng sản phẩm, tổng đơn hàng, tổng doanh thu.
- **Biểu đồ doanh thu**: Area Chart và Bar Chart, lọc theo Ngày / Tuần / Tháng / Năm.
- **Quản lý sản phẩm**: Thêm, sửa, xóa, upload ảnh lên cloud storage.
- **Quản lý đơn hàng**: Xem toàn bộ, cập nhật trạng thái (SHIPPING, DELIVERED, CANCELLED), xóa đơn.
- **Chat admin**: Nhận và trả lời tin nhắn từ khách hàng theo thời gian thực, badge thông báo chưa đọc.
- **Thông báo popup**: Hiển thị popup cho admin khi có đơn hàng mới hoặc chat mới.

---

## API Endpoint Tổng Quan

| Module | Prefix | Mô tả |
|---|---|---|
| Xác thực | `/api/auth` | Đăng ký, đăng nhập, Google OAuth |
| Sản phẩm | `/api/products` | CRUD sản phẩm, lọc theo brand/category |
| Danh mục | `/api/categories` | CRUD danh mục |
| Giỏ hàng | `/api/cart` | Thêm, xóa, cập nhật, lấy giỏ hàng |
| Đơn hàng | `/api/orders` | Tạo đơn, xem, cập nhật trạng thái |
| Thanh toán | `/api/payment` | Tạo URL VNPay, callback xử lý kết quả |
| Người dùng | `/api/users` | Cập nhật hồ sơ, đổi mật khẩu |
| Thông báo | `/api/notifications` | Lấy danh sách, đánh dấu đã đọc |
| Chat (REST) | `/api/chat` | Lấy lịch sử tin nhắn |
| Thống kê | `/api/statistics` | Doanh thu, số đơn theo thời gian |
| Upload file | `/api/files` | Upload ảnh lên S3/MinIO |
| WebSocket | `/ws-chat` | Kết nối STOMP qua SockJS |

---

## Lưu Ý Quan Trọng

- Toàn bộ hệ thống sử dụng encoding **UTF-8**.
- Hibernate `ddl-auto=none` - schema chỉ được quản lý qua file SQL thủ công.
- JWT được lưu tại `localStorage` phía client và tự động gắn vào mọi request qua `apiClient.ts`.
- Mọi chú thích code đều viết bằng **tiếng Việt có dấu**.
- File `.env.example` trong `FE-Application` chứa mẫu biến môi trường cần thiết cho production.

---

*Dự án được thực hiện bởi Antigravity Team.*
