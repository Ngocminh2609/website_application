import React from "react";
import { useCompare } from "../../hooks/Product/useCompare";
import {
  Typography,
  Row,
  Col,
  Card,
  Button,
  Empty,
  Tag,
  Layout,
  Tooltip,
} from "antd";
import {
  ShoppingCartOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { StarRating } from "../../components/common/ProductCard";
import { useCart } from "../../hooks/Cart/useCart";
import { handleImgError, parseSpecs } from "./helper";
import { styles } from "./styles/compare-page.styles";
import { PRODUCT_STRINGS } from "../../constants/Product/product";
import { formatVnd } from "../../utils/format";

const { Title, Text } = Typography;

const ComparePage: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const strings = PRODUCT_STRINGS.comparePage;

  if (compareItems.length === 0) {
    return (
      <Layout style={styles.layout}>
        <div style={styles.emptyContainer}>
          <Empty
            description={strings.empty}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate("/products")}>
              {strings.continueShopping}
            </Button>
          </Empty>
        </div>
      </Layout>
    );
  }

  // Lấy tất cả các key từ specifications của tất cả sản phẩm
  const allSpecKeys = Array.from(
    new Set(
      compareItems.flatMap((item) =>
        Object.keys(parseSpecs(item.specifications)),
      ),
    ),
  );

  return (
    <Layout style={styles.layoutActive}>
      <div className="main-content" style={styles.mainContent}>
        <div style={styles.headerRow}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            type="text"
          >
            {strings.backBtn}
          </Button>
          <Title level={2} style={styles.title}>
            {strings.title}
          </Title>
          <Button danger onClick={clearCompare}>
            {strings.clearAll}
          </Button>
        </div>

        <div style={styles.scrollContainer}>
          <div style={{ minWidth: compareItems.length * 300 + 200 }}>
            <Row gutter={[24, 24]} wrap={false}>
              {/* Cột tiêu đề thông số */}
              <Col span={4} style={styles.specsColumn}>
                <div style={styles.specRowHeader}>
                  {strings.priceLabel}
                </div>
                <div style={styles.specRowHeader}>
                  {strings.brandLabel}
                </div>
                <div style={styles.specRowHeader}>
                  {strings.ratingLabel}
                </div>

                <div style={styles.specsSubheader}>
                  <Text strong style={styles.specSubheaderText}>
                    {strings.specsLabel}
                  </Text>
                  <div style={styles.specSubheaderLine} />
                </div>

                {allSpecKeys.map((key) => (
                  <div key={key} style={styles.specRowName}>
                    {key}
                  </div>
                ))}
              </Col>

              {/* Các cột sản phẩm */}
              {compareItems.map((item) => {
                const specs = parseSpecs(item.specifications);
                return (
                  <Col key={item.id} style={{ width: "310px" }}>
                    <Card
                      hoverable
                      className="product-card"
                      cover={
                        <div style={styles.cardCoverWrapper}>
                          {/* Nút Xóa (Thiết kế y hệt nút Yêu thích của ProductCard) */}
                          <div style={styles.deleteBtnContainer}>
                            <Button
                              shape="circle"
                              icon={
                                <CloseOutlined style={{ fontSize: "14px" }} />
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFromCompare(item.id);
                              }}
                              style={styles.deleteBtn}
                            />
                          </div>

                          <img
                            alt={item.name}
                            src={item.imageUrl}
                            onError={handleImgError}
                            className="product-image"
                            style={styles.productImage}
                          />
                        </div>
                      }
                      style={styles.card}
                      styles={{ body: styles.cardBody }}
                    >
                      <div>
                        <Tooltip title={item.name}>
                          <Title
                            level={4}
                            style={styles.cardTitle}
                            ellipsis={{ rows: 2 }}
                          >
                            {item.name}
                          </Title>
                        </Tooltip>
                      </div>

                      <Button
                        type="primary"
                        block
                        icon={<ShoppingCartOutlined />}
                        style={styles.cartBtn}
                        onClick={async (e) => {
                          const target = e.currentTarget
                            .closest(".ant-card")
                            ?.querySelector("img");
                          if (target) {
                            const { flyToCart } =
                              await import("../../utils/cartAnimation");
                            flyToCart(target as HTMLImageElement);
                          }
                          const { cartApi } = await import("../../api/cartApi");
                          await cartApi.addToCart(item.id, 1);
                          await refreshCart(true);
                          navigate("/cart");
                        }}
                      >
                        {strings.addToCart}
                      </Button>
                    </Card>

                    {/* Dữ liệu so sánh */}
                    <div style={styles.dataContainer}>
                      <div style={styles.priceText}>
                        {formatVnd(item.price)}
                      </div>
                      <div style={styles.brandWrapper}>
                        <Tag color="blue">{item.brand || "TECH"}</Tag>
                      </div>
                      <div style={styles.ratingWrapper}>
                        <StarRating value={item.rating || 5} size={14} />
                        <span style={styles.ratingReviewCount}>
                          ({item.reviewCount || 0})
                        </span>
                      </div>
                      <div style={styles.dividerRow}>
                        <div style={styles.dividerLine} />
                      </div>

                      {allSpecKeys.map((key) => (
                        <div key={key} style={styles.specValueBox}>
                          {specs[key] || <Text type="secondary">---</Text>}
                        </div>
                      ))}
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComparePage;
