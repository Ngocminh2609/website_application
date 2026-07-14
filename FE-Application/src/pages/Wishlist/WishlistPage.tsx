import React, { useEffect } from "react";
import { Row, Col, Typography, Empty, Breadcrumb, Button } from "antd";
import { HeartFilled, DeleteOutlined, HomeOutlined } from "@ant-design/icons";
import { useWishlist } from "../../hooks/Wishlist/useWishlist";
import type { Product } from "../../types/product";
import ProductCard from "../../components/common/ProductCard";
import { Link, useLocation } from "react-router-dom";
import { WISHLIST_EMPTY_CARD_STYLE } from "../../styles/commonStyles";

const { Title, Text } = Typography;

/**
 * WishlistPage - Trang hiển thị danh sách sản phẩm yêu thích của người dùng.
 */
const WishlistPage: React.FC = () => {
  const { wishlistItems, removeFromWishlist, refreshWishlist } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist, location.key]);

  return (
    <div className="main-content">
      <Breadcrumb style={{ marginBottom: "24px" }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: "var(--text-main)" }}>Danh sách yêu thích</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "40px",
        }}
      >
        <HeartFilled style={{ fontSize: "36px", color: "#f43f5e" }} />
        <Title level={1} style={{ margin: 0, color: "var(--text-main)" }}>
          Danh sách yêu thích
        </Title>
        <Text
          style={{
            fontSize: "18px",
            marginLeft: "auto",
            color: "var(--text-muted)",
          }}
        >
          ({wishlistItems.length} sản phẩm)
        </Text>
      </div>

      {wishlistItems.length === 0 ? (
        <div style={WISHLIST_EMPTY_CARD_STYLE}>
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            description={
              <div style={{ marginTop: "24px" }}>
                <Text
                  style={{
                    fontSize: "20px",
                    display: "block",
                    marginBottom: "12px",
                    color: "var(--text-main)",
                    fontWeight: 600,
                  }}
                >
                  Danh sách yêu thích hiện đang trống
                </Text>
                <Text style={{ color: "var(--text-muted)", fontSize: "16px" }}>
                  Hãy thêm những sản phẩm bạn yêu thích để dễ dàng mua sắm sau
                  này.
                </Text>
              </div>
            }
          >
            <Link to="/products">
              <Button
                type="primary"
                size="large"
                style={{ marginTop: "24px", borderRadius: "8px" }}
              >
                Tiếp tục mua sắm
              </Button>
            </Link>
          </Empty>
        </div>
      ) : (
        <Row gutter={[32, 40]}>
          {wishlistItems.map((product: Product) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4}
              className="grid-5-cols-col"
              key={product.id}
            >
              <div style={{ position: "relative" }}>
                <ProductCard product={product} />
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    zIndex: 2,
                  }}
                >
                  <Button
                    shape="circle"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromWishlist(product.id)}
                    title="Xóa khỏi yêu thích"
                  />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default WishlistPage;
