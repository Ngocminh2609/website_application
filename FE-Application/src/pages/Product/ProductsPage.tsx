import React, { useMemo } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Space,
  Tag,
  Empty,
} from "antd";
import { RocketOutlined } from "@ant-design/icons";
import { useProductsPage } from "../../hooks/Product/useProductsPage";
import ProductCard from "../../components/common/ProductCard";
import { PageLoading } from "../../components/common/PageLoading";
import { ProductFilterSidebar } from "../../components/product/ProductFilterSidebar";
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
    return <PageLoading tip={strings.loading} style={styles.loadingContainer} />;
  }

  return (
    <Layout style={styles.layout}>
      <div className="main-content">
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
            />
          </Col>

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
