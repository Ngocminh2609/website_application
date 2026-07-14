import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component ScrollToTop tự động cuộn trang lên đầu (0, 0)
 * khi chuyển trang (thay đổi pathname) hoặc khi reload/render lại trang.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn lên đầu trang lập tức
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
