import React from "react";
import { Card, Typography, Tag, Tooltip, Space, Button } from "antd";
import {
  ShoppingCartOutlined,
  FireOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  SwapOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import BaseButton from "../common/BaseButton";
import { notification } from "../../utils/notification";
import { cartApi } from "../../api/cartApi";
import { useCart } from "../../hooks/Cart/useCart";
import { useWishlist } from "../../hooks/Wishlist/useWishlist";
import { useCompare } from "../../hooks/Product/useCompare";

import {
  FALLBACK_IMAGE,
  PRODUCT_CARD_STYLE,
  PRODUCT_CARD_BODY_STYLE,
  PRODUCT_CARD_BRAND_STYLE,
  PRODUCT_CARD_TITLE_STYLE,
  PRODUCT_CARD_DESC_STYLE,
} from "../../styles/commonStyles";

const { Paragraph, Title, Text } = Typography;

interface ProductCardProps {
  product: Product;
}

/**
 * Hiển thị số sao chính xác theo tỉ lệ thực (4.3 = 4 sao + 30% sao thứ 5).
 */
export const StarRating: React.FC<{ value: number; size?: number }> = ({
  value,
  size = 16,
}) => (
  <div
    style={{
      display: "inline-flex",
      gap: 3,
      alignItems: "center",
      lineHeight: 0,
    }}
  >
    {[1, 2, 3, 4, 5].map((star) => {
      const fillPercent = Math.min(
        100,
        Math.max(0, (value - (star - 1)) * 100),
      );
      return (
        <div
          key={star}
          style={{
            position: "relative",
            width: size,
            height: size,
            flexShrink: 0,
          }}
        >
          <StarFilled
            style={{
              color: "rgba(255,255,255,0.1)",
              fontSize: size,
              position: "absolute",
              top: 0,
              left: 0,
              display: "block",
            }}
          />
          {fillPercent > 0 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${fillPercent}%`,
                overflow: "hidden",
                height: "100%",
                display: "block",
                transition: "width 0.3s ease",
              }}
            >
              <StarFilled
                style={{
                  color: "#fadb14",
                  fontSize: size,
                  width: size,
                  display: "block",
                }}
              />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

/**
 * Thẻ hiển thị sản phẩm cao cấp (Premium Card)
 * Hỗ trợ hiển thị Rating, Flash Sale, Brand và giá gốc gạch ngang.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { refreshCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isComparing } = useCompare();

  const isFav = isInWishlist(product.id);
  const isComp = isComparing(product.id);

  // Sử dụng % giảm giá từ DB hoặc tự tính toán nếu chưa có
  const discountPercent =
    product.discountPercent ||
    (product.originalPrice && product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0);

  const imgRef = React.useRef<HTMLImageElement>(null);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error("Vui lòng đăng nhập để thực hiện");
      return;
    }

    try {
      // Thực hiện hiệu ứng bay ngay lập tức để tạo cảm giác phản hồi nhanh
      if (imgRef.current) {
        const { flyToCart } = await import("../../utils/cartAnimation");
        flyToCart(imgRef.current);
      }

      await cartApi.addToCart(product.id, 1);
      await refreshCart(true);
      // Có thể bỏ qua notification nếu hiệu ứng bay đã đủ rõ ràng,
      // hoặc giữ lại để xác nhận thành công
      notification.product.addCartSuccess();
    } catch {
      notification.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Tránh vòng lặp vô tận nếu chính ảnh fallback cũng không load được
    if (target.dataset.errored === "true") return;
    target.dataset.errored = "true";
    target.src = FALLBACK_IMAGE;
  };

  return (
    <Card
      hoverable
      className="animate-fade-up product-card"
      cover={
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            height: "260px",
            background: "var(--bg-secondary)",
          }}
        >
          {/* Badge Flash Sale */}
          {discountPercent > 0 && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                zIndex: 2,
              }}
            >
              <Tag
                color="#ef4444"
                style={{
                  borderRadius: "6px",
                  fontWeight: 700,
                  padding: "4px 8px",
                  border: "none",
                }}
              >
                <FireOutlined /> {discountPercent}% OFF
              </Tag>
            </div>
          )}

          {/* Nút Yêu thích */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 3,
            }}
          >
            <Button
              shape="circle"
              icon={
                isFav ? (
                  <HeartFilled style={{ color: "#f43f5e" }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={toggleWishlist}
              style={{
                background: isFav ? "rgba(255,255,255,0.9)" : "var(--glass-bg)",
                border: "none",
                backdropFilter: "blur(4px)",
                color: isFav ? "#f43f5e" : "var(--text-main)",
              }}
            />
          </div>

          {/* Nút So Sánh */}
          <div
            style={{
              position: "absolute",
              top: "56px",
              right: "12px",
              zIndex: 3,
            }}
          >
            <Tooltip title={isComp ? "Xóa khỏi so sánh" : "So sánh sản phẩm"}>
              <Button
                shape="circle"
                icon={<SwapOutlined style={{ transform: "rotate(90deg)" }} />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isComp) {
                    removeFromCompare(product.id);
                  } else {
                    addToCompare(product);
                  }
                }}
                style={{
                  background: isComp
                    ? "var(--primary-color)"
                    : "var(--glass-bg)",
                  border: "none",
                  backdropFilter: "blur(4px)",
                  color: isComp ? "#fff" : "var(--text-main)",
                  boxShadow: isComp ? "0 0 10px var(--primary-color)" : "none",
                }}
              />
            </Tooltip>
          </div>

          {/* Badge Best Seller */}
          {product.isBestSeller && !isFav && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                zIndex: 2,
              }}
            >
              <Tag
                color="#f59e0b"
                style={{
                  borderRadius: "6px",
                  fontWeight: 700,
                  padding: "4px 8px",
                  border: "none",
                }}
              >
                BÁN CHẠY
              </Tag>
            </div>
          )}

          <Link to={`/product/${product.id}`}>
            <img
              ref={imgRef}
              alt={product.name}
              src={product.imageUrl}
              onError={handleImgError}
              className="product-image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
            />
          </Link>
        </div>
      }
      style={PRODUCT_CARD_STYLE}
      styles={{
        body: PRODUCT_CARD_BODY_STYLE,
      }}
    >
      <div>
        {/* Brand & Rating */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <Text style={PRODUCT_CARD_BRAND_STYLE}>
            {product.brand || "TECH"}
          </Text>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <StarRating value={product.rating || 5} size={10} />
            <Text style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              ({product.reviewCount || 0})
            </Text>
          </div>
        </div>

        {/* Tiêu đề */}
        <Tooltip title={product.name}>
          <Link to={`/product/${product.id}`}>
            <Title
              level={4}
              style={PRODUCT_CARD_TITLE_STYLE}
              ellipsis={{ rows: 1 }}
            >
              {product.name}
            </Title>
          </Link>
        </Tooltip>

        {/* Mô tả */}
        <Paragraph
          type="secondary"
          style={PRODUCT_CARD_DESC_STYLE}
          ellipsis={{ rows: 2 }}
        >
          {product.description}
        </Paragraph>
      </div>

      {/* Footer: Giá & Nút */}
      <div style={{ marginTop: "auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <Title
            level={3}
            style={{
              margin: 0,
              color: "inherit",
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          >
            {(product.price ?? 0).toLocaleString("vi-VN")} ₫
          </Title>
          {product.originalPrice && (
            <Text
              delete
              style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
            >
              {(product.originalPrice ?? 0).toLocaleString("vi-VN")} ₫
            </Text>
          )}
        </div>

        <Space direction="vertical" style={{ width: "100%" }} size="small">
          <BaseButton
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            style={{
              width: "100%",
              height: "42px",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            Thêm Vào Giỏ
          </BaseButton>
          <Link to={`/product/${product.id}`} style={{ width: "100%" }}>
            <BaseButton
              icon={<EyeOutlined />}
              style={{
                width: "100%",
                height: "42px",
                borderRadius: "10px",
                fontWeight: 600,
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
                color: "var(--text-main)",
              }}
            >
              Xem Chi Tiết
            </BaseButton>
          </Link>
        </Space>
      </div>
    </Card>
  );
};

export default ProductCard;
