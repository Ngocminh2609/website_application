import React from "react";
import { Row, Col, Typography, Empty, Breadcrumb, Button } from "antd";
import { HeartFilled, DeleteOutlined, HomeOutlined } from "@ant-design/icons";
import { useWishlistPage } from "../../hooks/Wishlist/useWishlistPage";
import type { Product } from "../../types/product";
import ProductCard from "../../components/common/ProductCard";
import { Link } from "react-router-dom";
import { styles } from "./styles/wishlist-page.styles";
import { WISHLIST_STRINGS } from "../../constants/Wishlist/wishlist";

const { Title, Text } = Typography;

/**
 * WishlistPage - Trang hiển thị danh sách sản phẩm yêu thích của người dùng.
 */
const WishlistPage: React.FC = () => {
  const { wishlistItems, removeFromWishlist } = useWishlistPage();

  return (
    <div className="main-content">
      <Breadcrumb style={styles.breadcrumb}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> {WISHLIST_STRINGS.breadcrumbHome}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={styles.breadcrumbActive}>
            {WISHLIST_STRINGS.breadcrumbWishlist}
          </span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <div style={styles.headerRow}>
        <HeartFilled style={styles.headerIcon} />
        <Title level={1} style={styles.headerTitle}>
          {WISHLIST_STRINGS.title}
        </Title>
        <Text style={styles.headerCount}>
          ({wishlistItems.length} {WISHLIST_STRINGS.productCountSuffix})
        </Text>
      </div>

      {wishlistItems.length === 0 ? (
        <div style={styles.emptyCard}>
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            description={
              <div style={styles.emptyDescriptionWrapper}>
                <Text style={styles.emptyTitle}>
                  {WISHLIST_STRINGS.emptyTitle}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {WISHLIST_STRINGS.emptySubtitle}
                </Text>
              </div>
            }
          >
            <Link to="/products">
              <Button
                type="primary"
                size="large"
                style={styles.continueShoppingBtn}
              >
                {WISHLIST_STRINGS.continueShopping}
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
              <div style={styles.productCardWrapper}>
                <ProductCard product={product} />
                <div style={styles.actionButtonsContainer}>
                  <Button
                    shape="circle"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromWishlist(product.id)}
                    title={WISHLIST_STRINGS.removeBtnTooltip}
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
