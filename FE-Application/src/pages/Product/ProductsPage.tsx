import React, { useMemo } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Checkbox,
  Slider,
  Space,
  Card,
  Tag,
  Empty,
  Spin,
} from "antd";
import { FilterOutlined, RocketOutlined } from "@ant-design/icons";
import { useProductsPage } from "../../hooks/Product/useProductsPage";
import ProductCard from "../../components/common/ProductCard";
import { getUniqueBrands, filterProducts } from "./helper";
import { styles } from "./styles/products-page.styles";
import { PRODUCT_STRINGS } from "../../constants/Product/product";

const { Title, Text } = Typography;

/**
 * Trang danh sách sản phẩm đầy đủ với bộ lọc hiện đại.
 * Hỗ trợ lọc theo Hãng (Brand), Danh mục (Category) và Giá (Price).
 */
const ProductsPage: React.FC = () => {
  const {
    products,
    categories,
    loading,
    selectedBrands,
    setSelectedBrands,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
  } = useProductsPage();

  const strings = PRODUCT_STRINGS.productsPage;

  const brands = useMemo(() => {
    return getUniqueBrands(products);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return filterProducts(
      products,
      selectedBrands,
      selectedCategories,
      priceRange,
    );
  }, [products, selectedBrands, selectedCategories, priceRange]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spin size="large" tip={strings.loading} />
      </div>
    );
  }

  return (
    <Layout style={styles.layout}>
      <div className="main-content">
        <Row gutter={[40, 40]}>
          {/* SIDEBAR FILTER */}
          <Col xs={24} lg={6}>
            <div style={styles.sidebarWrapper}>
              <Card
                title={
                  <Title level={4} style={styles.filterTitle}>
                    <FilterOutlined /> {strings.filterTitle}
                  </Title>
                }
                style={styles.sidebarCard}
                styles={{
                  body: styles.sidebarCardBody,
                  header: styles.sidebarCardHeader,
                }}
              >
                <Space direction="vertical" size="large" style={styles.fullWidthSpace}>
                  <div>
                    <Text strong style={styles.filterSectionTitle}>
                      {strings.brandLabel}
                    </Text>
                    <Checkbox.Group
                      options={brands}
                      value={selectedBrands}
                      onChange={(vals) => setSelectedBrands(vals as string[])}
                      style={styles.checkboxGroup}
                    />
                  </div>

                  <div>
                    <Text strong style={styles.filterSectionTitle}>
                      {strings.categoryLabel}
                    </Text>
                    <Checkbox.Group
                      value={selectedCategories}
                      onChange={(vals) =>
                        setSelectedCategories(vals as number[])
                      }
                      style={styles.checkboxGroup}
                    >
                      {categories.map((cat) => (
                        <Checkbox
                          key={cat.id}
                          value={cat.id}
                          style={{ color: "var(--text-muted)" }}
                        >
                          {cat.name}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </div>

                  <div>
                    <Text strong style={styles.filterSectionTitle}>
                      {strings.priceRangeLabel}
                    </Text>
                    <Slider
                      range
                      min={0}
                      max={100000000}
                      step={500000}
                      value={priceRange}
                      onChange={(val) => setPriceRange(val as [number, number])}
                      tooltip={{
                        formatter: (val) => `${val?.toLocaleString("vi-VN")} ₫`,
                      }}
                      trackStyle={[styles.sliderTrack]}
                      handleStyle={[
                        styles.sliderHandle,
                        styles.sliderHandle,
                      ]}
                    />
                    <div style={styles.sliderPriceRow}>
                      <Text style={styles.sliderPriceText}>
                        {priceRange[0].toLocaleString("vi-VN")} ₫
                      </Text>
                      <Text style={styles.sliderPriceText}>
                        {priceRange[1].toLocaleString("vi-VN")} ₫
                      </Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </div>
          </Col>

          {/* PRODUCT LIST CONTENT */}
          <Col xs={24} lg={18}>
            <div style={styles.productListHeader}>
              <div>
                <Title level={2} style={styles.productListTitle}>
                  {strings.title}
                </Title>
                <Text style={styles.productListSubtitle}>
                  Tìm thấy {filteredProducts.length} sản phẩm phù hợp
                </Text>
              </div>
              <Space>
                <Tag color="blue" icon={<RocketOutlined />}>
                  Giao nhanh 2h
                </Tag>
                <Tag color="purple">Chính hãng 100%</Tag>
              </Space>
            </div>

            {filteredProducts.length > 0 ? (
              <Row gutter={[24, 24]}>
                {filteredProducts.map((product) => (
                  <Col xs={24} sm={12} md={8} xl={8} xxl={6} key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={styles.emptyResultBox}>
                <Empty
                  description={
                    <span style={styles.emptyResultText}>
                      {strings.emptyResult}
                    </span>
                  }
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default ProductsPage;
