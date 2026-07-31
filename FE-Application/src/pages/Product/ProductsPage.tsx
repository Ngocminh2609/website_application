import React, {useMemo} from "react";
import {
    Typography,
    Space,
    Tag,
    Empty,
} from "antd";
import {RocketOutlined} from "@ant-design/icons";
import {useProductsPage} from "../../hooks/Product/useProductsPage";
import {ProductFilterSidebar} from "../../components/product/ProductFilterSidebar";
import ProductListingLayout from "../../components/product/ProductListingLayout";
import {getUniqueBrands, filterProducts} from "./helper";
import {styles} from "./styles/products-page.styles";
import {PRODUCT_STRINGS} from "../../constants/Product/product";

const {Title, Text} = Typography;

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

    return (
        <ProductListingLayout
            loading={loading}
            loadingTip={strings.loading}
            loadingStyle={styles.loadingContainer}
            layoutStyle={styles.layout}
            sidebar={
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
            }
            header={
                <div style={styles.productListHeader}>
                    <div>
                        <Title level={2} style={styles.productListTitle}>{strings.title}</Title>
                        <Text style={styles.productListSubtitle}>
                            Tìm thấy {filteredProducts.length} sản phẩm phù hợp
                        </Text>
                    </div>
                    <Space>
                        <Tag color="blue" icon={<RocketOutlined/>}>Giao nhanh 2h</Tag>
                        <Tag color="purple">Chính hãng 100%</Tag>
                    </Space>
                </div>
            }
            products={filteredProducts}
            emptyContent={
                <div style={styles.emptyResultBox}>
                    <Empty description={<span style={styles.emptyResultText}>{strings.emptyResult}</span>}/>
                </div>
            }
            productColProps={{xs: 24, sm: 12, md: 8, xl: 8, xxl: 6}}
        />
    );
};

export default ProductsPage;
