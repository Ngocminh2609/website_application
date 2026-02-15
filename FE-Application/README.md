# Tech Nova - Frontend Application

Ứng dụng Frontend cho Website bán hàng công nghệ cao cấp, được xây dựng trên nền tảng React và TypeScript với hiệu năng vượt trội.

## ✨ Điểm Nổi Bật
- **Thiết kế Glassmorphism**: Sử dụng hiệu ứng kính mờ hiện đại, tạo cảm giác sang trọng và chuyên nghiệp.
- **TypeScript Enterprise Structure**: Cấu trúc phân lớp rõ ràng (api, types, components, pages) giúp dễ dàng bảo trì và mở rộng.
- **Vite Power**: Tốc độ build và hot-reload cực nhanh.
- **Dynamic Content**: Dữ liệu sản phẩm được lấy động từ Backend REST API.

## 📁 Cấu Trúc Mã Nguồn
- `src/api/`: Quản lý các dịch vụ gọi API (Product Services).
- `src/components/`: Các thành phần giao diện tái sử dụng (Common, Layout).
- `src/pages/`: Các trang chính của ứng dụng (HomePage).
- `src/types/`: Định nghĩa kiểu dữ liệu nghiêm ngặt.
- `src/index.css`: Hệ thống thiết kế Design System toàn cục.

## 🛠️ Cài Đặt & Phát Triển
1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```
2. **Chạy dự án (Dev mode)**:
   ```bash
   npm run dev
   ```
3. **Build sản phẩm**:
   ```bash
   npm run build
   ```

## 🌐 Kết Nối Backend
URL mặc định của Backend được cấu hình tại `src/api/apiClient.ts`:
```typescript
const BASE_URL = 'http://localhost:8080/api';
```

## 📜 Quy Tắc Code
- Sử dụng `import type` cho các Type/Interface để tối ưu hóa module.
- Tuân thủ cấu trúc thư mục đã đề ra.
- Comment code bằng tiếng Việt có dấu.
