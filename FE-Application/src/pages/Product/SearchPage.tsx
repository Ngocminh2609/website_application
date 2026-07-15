import React, { useMemo } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Space,
  Tag,
  Empty,
  Breadcrumb,
} from "antd";
import {
  SearchOutlined,
  RocketOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSearchPage } from "../../hooks/Product/useSearchPage";
import ProductCard from "../../components/common/ProductCard";
import { PageLoading } from "../../components/common/PageLoading";
import { ProductFilterSidebar } from "../../components/product/ProductFilterSidebar";
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
      <PageLoading
        tip={<Text style={styles.loadingText}>{strings.loading}</Text>}
        style={styles.loadingContainer}
      />
    );
  }

  return (
    <Layout style={styles.layout}>
      <div className="main-content">
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
          <Col xs={24} lg={6}>
            <ProductFilterSidebar
              brands={brands}
              categories={categories}
              selectedBrands={selectedBrands}
              onBrandsChange={setSelectedBrands}
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              labels={{
                filterTitle: strings.filterTitle,
                brandLabel: strings.brandLabel,
                categoryLabel: strings.categoryLabel,
                priceRangeLabel: strings.priceRangeLabel,
              }}
              hideEmptyBrands
              priceStep={1000000}
              className="glass-effect"
              bordered={false}
            />
          </Col>

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
