import { getFlyerInitialStyles } from "./styles/cart-animation.styles";

/**
 * Hàm tạo hiệu ứng "bay" từ sản phẩm vào giỏ hàng.
 * @param sourceEl Phần tử nguồn (thường là ảnh sản phẩm)
 * @param targetElId ID của phần tử đích (mặc định là 'cart-icon')
 */
export const flyToCart = (
  sourceEl: HTMLElement | null,
  targetElId: string = "cart-icon",
) => {
  const targetEl = document.getElementById(targetElId);
  if (!sourceEl || !targetEl) return;

  // Lấy vị trí và kích thước
  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();

  // Tạo phần tử bay - sử dụng clone để giữ nguyên hình ảnh
  const flyer = sourceEl.cloneNode(true) as HTMLElement;

  // Thiết lập style cơ bản cho flyer
  const initialStyles = getFlyerInitialStyles(sourceRect);

  Object.assign(flyer.style, initialStyles);

  // Thêm vào body để không bị ảnh hưởng bởi overflow của cha
  document.body.appendChild(flyer);

  // Bắt đầu hiệu ứng trong frame tiếp theo
  requestAnimationFrame(() => {
    // Di chuyển đến tâm của giỏ hàng
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    flyer.style.top = `${targetY}px`;
    flyer.style.left = `${targetX}px`;

    // Thu nhỏ và xoay vòng chuyên nghiệp
    flyer.style.width = "10px";
    flyer.style.height = "10px";
    flyer.style.opacity = "0.2";
    flyer.style.transform = "translate(-50%, -50%) rotate(720deg) scale(0.1)";
    flyer.style.borderRadius = "50%";
  });

  // Xử lý sau khi hoàn tất animation
  setTimeout(() => {
    if (flyer.parentNode) {
      flyer.remove();
    }

    // Tạo hiệu ứng rung nhẹ (bounce) cho giỏ hàng
    targetEl.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.3)", color: "var(--primary-color)" },
        { transform: "scale(0.9)" },
        { transform: "scale(1.1)" },
        { transform: "scale(1)" },
      ],
      {
        duration: 400,
        easing: "ease-out",
      },
    );
  }, 800);
};
