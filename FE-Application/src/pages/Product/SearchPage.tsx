import React, { useMemo } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Space,
  Card,
  Tag,
  Empty,
  Spin,
  Checkbox,
  Slider,
  Breadcrumb,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  RocketOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSearchPage } from "../../hooks/Product/useSearchPage";
import ProductCard from "../../components/common/ProductCard";
import { getUniqueBrands, filterProducts } from "./helper";
import { styles } from "./styles/search-page.styles";
import { PRODUCT_STRINGS } from "../../constants/Product/product";

const { Title, Text } = Typography;

/**
 * Trang Kết quả tìm kiếm sản phẩm chuyên nghiệp.
 * Hỗ trợ tìm kiếm thời gian thực qua URL và lọc kết quả thông minh.
 */
const SearchPage: React.FC = () => {
  const {
    query,
    categories,
    products,
    loading,
    selectedBrands,
    setSelectedBrands,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
  } = useSearchPage();

  const strings = PRODUCT_STRINGS.searchPage;

  // Trích xuất danh sách thương hiệu duy nhất từ kết quả
  const brands = useMemo(() => {
    return getUniqueBrands(products);
  }, [products]);

  // Logic lọc sản phẩm tại Client
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
        <Spin
          size="large"
          tip={
            <Text style={styles.loadingText}>
              {strings.loading}
            </Text>
          }
        />
      </div>
    );
  }

  return (
    <Layout style={styles.layout}>
      <div className="main-content">
        {/* BREADCRUMB */}
        <Breadcrumb
          items={[
            {
              title: (
                <Link to="/" style={styles.breadcrumbLink}>
                  <HomeOutlined /> Trang chủ
                </Link>
              ),
            },
            {
              title: (
                <span style={styles.breadcrumbActive}>
                  Tìm kiếm: "{query}"
                </span>
              ),
            },
          ]}
          style={styles.breadcrumbContainer}
        />

        <Row gutter={[40, 40]}>
          {/* BỘ LỌC (SIDEBAR) */}
          <Col xs={24} lg={6}>
            <div style={styles.sidebarWrapper}>
              <Card
                title={
                  <Title level={4} style={styles.filterCardTitle}>
                    <FilterOutlined /> {strings.filterTitle}
                  </Title>
                }
                className="glass-effect"
                bordered={false}
                styles={{ body: styles.filterCardBody }}
              >
                <Space direction="vertical" size="large" style={styles.fullWidthSpace}>
                  {brands.length > 0 && (
                    <div>
                      <Text strong style={styles.filterSectionTitle}>
                        {strings.brandLabel}
                      </Text>
                      <Checkbox.Group
                        options={brands}
                        value={selectedBrands}
                        onChange={(vals) => setSelectedBrands(vals as string[])}
                        style={styles.checkboxGroup}
                        className="premium-checkbox"
                      />
                    </div>
                  )}

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
                      className="premium-checkbox"
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
                      step={1000000}
                      value={priceRange}
                      onChange={(val) => setPriceRange(val as [number, number])}
                      trackStyle={[styles.sliderTrack]}
                    />
                    <div style={styles.sliderPriceRow}>
                      <Text style={styles.sliderPriceText}>
                        {priceRange[0].toLocaleString()} ₫
                      </Text>
                      <Text style={styles.sliderPriceText}>
                        {priceRange[1].toLocaleString()} ₫
                      </Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </div>
          </Col>

          {/* DANH SÁCH KẾT QUẢ */}
          <Col xs={24} lg={18}>
            <div style={styles.headerRow}>
              <div>
                <Title level={2} style={styles.headerTitle}>
                  <SearchOutlined style={{ color: "var(--primary-color)" }} />
                  {strings.titlePrefix}
                </Title>
                <Text style={styles.headerSubtitle}>
                  Tìm thấy <b>{filteredProducts.length}</b> sản phẩm cho từ khóa
                  "<b>{query}</b>"
                </Text>
              </div>
              <Space className="desktop-only">
                <Tag color="blue" icon={<RocketOutlined />}>
                  Chính hãng
                </Tag>
                <Tag color="purple">Giao nhanh</Tag>
              </Space>
            </div>

            {filteredProducts.length > 0 ? (
              <Row gutter={[24, 32]}>
                {filteredProducts.map((product) => (
                  <Col xs={24} sm={12} md={8} xl={6} key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={styles.emptyResultContainer}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_DEFAULT}
                  description={
                    <Space direction="vertical" size="small">
                      <Text style={styles.emptyTitle}>
                        Rất tiếc, Tech Nova không tìm thấy sản phẩm nào!
                      </Text>
                      <Text style={styles.emptySubtitle}>
                        Hãy thử điều chỉnh lại từ khóa hoặc bộ lọc để có kết quả
                        tốt hơn.
                      </Text>
                    </Space>
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

export default SearchPage;
