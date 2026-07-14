import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component ScrollToTop tự động cuộn trang lên đầu (0, 0)
 * khi chuyển trang (thay đổi pathname) hoặc khi reload/render lại trang.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Tắt tính năng tự động khôi phục vị trí cuộn của trình duyệt khi reload
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // Cuộn lên đầu trang lập tức
    window.scrollTo(0, 0);

    // Sử dụng thêm timeout ngắn để đề phòng trường hợp layout shift do load dữ liệu chậm
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
