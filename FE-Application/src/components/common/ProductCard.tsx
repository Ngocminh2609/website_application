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
import { styles } from "./styles/ProductCard.styles";
import { COMMON_STRINGS } from "../../constants/Common/common";

const { productCard: pcStrings } = COMMON_STRINGS;

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
  <div style={styles.ratingContainer}>
    {[1, 2, 3, 4, 5].map((star) => {
      const fillPercent = Math.min(
        100,
        Math.max(0, (value - (star - 1)) * 100),
      );
      return (
        <div key={star} style={styles.starWrapper(size)}>
          <StarFilled style={styles.starBackground(size)} />
          {fillPercent > 0 && (
            <div style={styles.starForegroundWrapper(fillPercent)}>
              <StarFilled style={styles.starForeground(size)} />
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
      notification.error(pcStrings.loginRequired);
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
      notification.error(pcStrings.addCartError);
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
    // Tránh vòng lặp vô chậm nếu chính ảnh fallback cũng không load được
    if (target.dataset.errored === "true") return;
    target.dataset.errored = "true";
    target.src = FALLBACK_IMAGE;
  };

  return (
    <Card
      hoverable
      className="animate-fade-up product-card"
      cover={
        <div style={styles.coverWrapper}>
          {/* Badge Flash Sale */}
          {discountPercent > 0 && (
            <div style={styles.discountTagWrapper}>
              <Tag color="#ef4444" style={styles.discountTag}>
                <FireOutlined /> {discountPercent}% {pcStrings.off}
              </Tag>
            </div>
          )}

          {/* Nút Yêu thích */}
          <div style={styles.wishlistBtnWrapper}>
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
              style={styles.wishlistBtn(isFav)}
            />
          </div>

          {/* Nút So Sánh */}
          <div style={styles.compareBtnWrapper}>
            <Tooltip
              title={
                isComp ? pcStrings.removeFromCompare : pcStrings.addToCompare
              }
            >
              <Button
                shape="circle"
                icon={<SwapOutlined style={styles.compareIcon} />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isComp) {
                    removeFromCompare(product.id);
                  } else {
                    addToCompare(product);
                  }
                }}
                style={styles.compareBtn(isComp)}
              />
            </Tooltip>
          </div>

          {/* Badge Best Seller */}
          {product.isBestSeller && !isFav && (
            <div style={styles.bestSellerTagWrapper}>
              <Tag color="#f59e0b" style={styles.bestSellerTag}>
                {pcStrings.bestSeller}
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
              style={styles.productImage}
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
        <div style={styles.brandRatingContainer}>
          <Text style={PRODUCT_CARD_BRAND_STYLE}>
            {product.brand || pcStrings.defaultBrand}
          </Text>
          <div style={styles.ratingWrapper}>
            <StarRating value={product.rating || 5} size={10} />
            <Text style={styles.reviewCount}>({product.reviewCount || 0})</Text>
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
      <div style={styles.footerContainer}>
        <div style={styles.priceContainer}>
          <Title level={3} style={styles.priceText}>
            {(product.price ?? 0).toLocaleString("vi-VN")} ₫
          </Title>
          {product.originalPrice && (
            <Text delete style={styles.originalPriceText}>
              {(product.originalPrice ?? 0).toLocaleString("vi-VN")} ₫
            </Text>
          )}
        </div>

        <Space direction="vertical" style={styles.actionsSpace} size="small">
          <BaseButton
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            style={styles.addCartBtn}
          >
            {pcStrings.addToCart}
          </BaseButton>
          <Link
            to={`/product/${product.id}`}
            style={styles.viewDetailBtnWrapper}
          >
            <BaseButton icon={<EyeOutlined />} style={styles.viewDetailBtn}>
              {pcStrings.viewDetails}
            </BaseButton>
          </Link>
        </Space>
      </div>
    </Card>
  );
};

export default ProductCard;
