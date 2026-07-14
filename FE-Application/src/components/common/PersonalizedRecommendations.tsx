import React from "react";
import { Typography, Row, Col, Spin } from "antd";
import { usePersonalizedProducts } from "../../hooks/Product/usePersonalizedProducts";
import ProductCard from "./ProductCard";
import { StarOutlined } from "@ant-design/icons";
import { styles } from "./styles/PersonalizedRecommendations.styles";
import { COMMON_STRINGS } from "../../constants/Common/common";

const { Title, Text } = Typography;

interface PersonalizedRecommendationsProps {
  title?: string;
  description?: string;
  limit?: number;
}

const { personalizedRecommendations: prStrings } = COMMON_STRINGS;

/**
 * Component hiển thị danh sách sản phẩm gợi ý cá nhân hóa.
 * Mang lại trải nghiệm chuyên nghiệp và độc đáo cho từng người dùng.
 */
const PersonalizedRecommendations: React.FC<
  PersonalizedRecommendationsProps
> = ({
  title = prStrings.defaultTitle,
  description = prStrings.defaultDescription,
  limit = 5,
}) => {
  const { personalized, loading } = usePersonalizedProducts(limit);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spin size="large" tip={prStrings.loadingTip} />
      </div>
    );
  }

  if (personalized.length === 0) return null;

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <div style={styles.titleContainer}>
          <StarOutlined style={styles.starIcon} />
          <Title level={2} style={styles.title}>
            {title}
          </Title>
        </div>
        <Text type="secondary" style={styles.description}>
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
