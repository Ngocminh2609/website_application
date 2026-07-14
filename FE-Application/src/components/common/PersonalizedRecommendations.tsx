import React from "react";
import { Typography, Row, Col, Spin } from "antd";
import { usePersonalizedProducts } from "../../hooks/Product/usePersonalizedProducts";
import ProductCard from "./ProductCard";
import { StarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface PersonalizedRecommendationsProps {
  title?: string;
  description?: string;
  limit?: number;
}

/**
 * Component hiển thị danh sách sản phẩm gợi ý cá nhân hóa.
 * Mang lại trải nghiệm chuyên nghiệp và độc đáo cho từng người dùng.
 */
const PersonalizedRecommendations: React.FC<
  PersonalizedRecommendationsProps
> = ({
  title = "Dành Riêng Cho Bạn",
  description = "Dựa trên sở thích và lịch sử xem sản phẩm của bạn.",
  limit = 5,
}) => {
  const { personalized, loading } = usePersonalizedProducts(limit);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Spin size="large" tip="Đang chuẩn bị gợi ý..." />
      </div>
    );
  }

  if (personalized.length === 0) return null;

  return (
    <section style={{ margin: "60px 0" }}>
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <StarOutlined
            style={{ fontSize: "24px", color: "var(--primary-color)" }}
          />
          <Title
            level={2}
            style={{ margin: 0, fontSize: "2rem", fontWeight: 800 }}
          >
            {title}
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "1.1rem" }}>
          {description}
        </Text>
      </div>

      <Row gutter={[24, 32]}>
        {personalized.map((product) => (
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4.8}
            key={product.id}
            className="grid-5-cols-col"
          >
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default PersonalizedRecommendations;
