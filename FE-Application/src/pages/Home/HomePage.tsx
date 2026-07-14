import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Space, Divider, Spin, Carousel } from "antd";
import {
    ThunderboltFilled,
    ArrowRightOutlined,
    StarFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/Product/useProducts";
import type { Product } from "../../types/product";
import type { Banner } from "../../types/banner";
import { bannerApi } from "../../api/bannerApi";
import ProductCard from "../../components/common/ProductCard";
import BaseButton from "../../components/common/BaseButton";
import PersonalizedRecommendations from "../../components/common/PersonalizedRecommendations";
import { getDisplayProducts, formatBrandsData, resolveBanners } from "./helper";
import { styles } from "./styles/home-page.styles";
import { HOME_STRINGS } from "../../constants/Home/home-page";

const { Title, Text, Paragraph } = Typography;

/**
 * Trang chủ Tech Nova - Phiên bản nâng cấp tối ưu tương phản và thân thiện người dùng.
 * Chỉnh sửa: Chữ màu trắng/sáng trên nền tối, loại bỏ các thành phần gây rối mắt.
 */
const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const {
        flashSales,
        bestSellers,
        categories,
        loading: productLoading,
        initializeHomeData,
        fetchProductsByBrand,
    } = useProducts();
    const [brandsData, setBrandsData] = useState<
        { id: string; name: string; products: Product[] }[]
    >([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loadingBrands, setLoadingBrands] = useState<boolean>(true);

    const displayFlashSales = getDisplayProducts(flashSales, "Flash Sale");
    const displayBestSellers = getDisplayProducts(bestSellers, "Bán Chạy", 5);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoadingBrands(true);
                // Khởi tạo các danh sách chính (Flash Sale, Best Seller, Categories) từ Context để tránh gọi trùng
                await initializeHomeData();

                // Sử dụng hàm từ context để đảm bảo cơ chế Single Flight (không gọi trùng lặp Apple/Samsung)
                const [apple, samsung, activeBanners] = await Promise.all([
                    fetchProductsByBrand("Apple"),
                    fetchProductsByBrand("Samsung"),
                    bannerApi.getActiveBanners().catch((err) => {
                        console.error("Lỗi khi tải banners:", err);
                        return [];
                    }),
                ]);

                setBrandsData(formatBrandsData(apple, samsung));
                setBanners(resolveBanners(activeBanners));
            } catch (error) {
                console.error("Lỗi khi tải trang chủ:", error);
            } finally {
                setLoadingBrands(false);
            }
        };

        fetchHomeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Chỉ chạy 1 lần khi mount - initializeHomeData & fetchProductsByBrand là useCallback ổn định

    if (productLoading || loadingBrands) {
        return (
            <div style={styles.loadingContainer}>
                <Spin
                    size="large"
                    tip={
                        <Text style={styles.loadingText}>
                            {HOME_STRINGS.loading}
                        </Text>
                    }
                />
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={styles.pageContainer}>
            {/* HERO SECTION - Tối ưu chữ sáng trên nền tối */}
            <section className="hero-section" style={styles.heroSection}>
                <div className="main-content">
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} lg={13}>
                            <Title className="hero-title" style={styles.heroTitle}>
                                {HOME_STRINGS.hero.titleLine1} <br />
                                <span style={styles.primaryColorText}>{HOME_STRINGS.hero.titleHighlight} </span>
                                {HOME_STRINGS.hero.titleLine2}
                            </Title>
                            <Paragraph style={styles.heroParagraph}>
                                {HOME_STRINGS.hero.description}
                            </Paragraph>
                            <Space size="large">
                                <BaseButton
                                    type="primary"
                                    size="large"
                                    onClick={() => navigate("/products")}
                                    style={styles.exploreButton}
                                >
                                    {HOME_STRINGS.hero.exploreBtn}
                                </BaseButton>
                                <BaseButton
                                    size="large"
                                    ghost
                                    style={styles.offerButton}
                                >
                                    {HOME_STRINGS.hero.offersBtn}
                                </BaseButton>
                            </Space>

                            <div style={styles.statsContainer}>
                                <div>
                                    <Title level={3} style={styles.statsNumber}>
                                        {HOME_STRINGS.stats.customersCount}
                                    </Title>
                                    <Text style={styles.statsLabel}>{HOME_STRINGS.stats.customersLabel}</Text>
                                </div>
                                <Divider type="vertical" style={styles.statsDivider} />
                                <div>
                                    <Title level={3} style={styles.statsNumber}>
                                        {HOME_STRINGS.stats.brandsCount}
                                    </Title>
                                    <Text style={styles.statsLabel}>{HOME_STRINGS.stats.brandsLabel}</Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} lg={11}>
                            {/* Slide Banner đặt bên phải để lấp đầy khoảng trống hero section */}
                            {banners.length > 0 && (
                                <div style={styles.carouselWrapper}>
                                    <Carousel
                                        key={banners.map((b) => b.id).join(",")}
                                        autoplay
                                        effect="fade"
                                        speed={800}
                                        autoplaySpeed={4000}
                                    >
                                        {banners.map((banner) => (
                                            <div
                                                key={banner.id}
                                                onClick={() =>
                                                    banner.linkUrl && navigate(banner.linkUrl)
                                                }
                                                style={styles.carouselItemContainer(!!banner.linkUrl)}
                                            >
                                                <div style={styles.carouselItemInner(banner.imageUrl)}>
                                                    {banner.title && (
                                                        <Title level={3} style={styles.carouselTitle}>
                                                            {banner.title}
                                                        </Title>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            </section>

            <div className="main-content">
                {/* CATEGORY NAV - Nền rõ ràng, chữ nổi */}
                <div style={styles.categoryNavContainer}>
                    <Text style={styles.categoryNavSub}>{HOME_STRINGS.categories.title}</Text>
                    <div style={styles.categoryList} className="no-scrollbar">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => navigate(`/products?category=${cat.id}`)}
                                style={styles.categoryItem}
                                className="category-item-hover"
                            >
                                <Text style={styles.categoryItemText}>{cat.name}</Text>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GỢI Ý CÁ NHÂN HÓA - Kỹ thuật tạo khác biệt */}
                <PersonalizedRecommendations title={HOME_STRINGS.recommendations.title} limit={5} />

                {/* FLASH SALE - Chữ sáng, nền nhấn đỏ */}
                {displayFlashSales.length > 0 && (
                    <section style={styles.flashSalesSection}>
                        <div style={styles.sectionHeader}>
                            <div style={styles.sectionTitleWrapper}>
                                <div style={styles.flashIconWrapper}>
                                    <ThunderboltFilled style={styles.flashIcon} />
                                </div>
                                <div>
                                    <Title level={2} style={styles.sectionTitle}>
                                        {HOME_STRINGS.flashSale.title}
                                    </Title>
                                    <Text style={styles.flashTimer}>
                                        {HOME_STRINGS.flashSale.countdown}
                                    </Text>
                                </div>
                            </div>
                            <BaseButton
                                type="link"
                                onClick={() => navigate("/products")}
                                style={styles.viewAllButton}
                            >
                                {HOME_STRINGS.flashSale.viewAll} <ArrowRightOutlined />
                            </BaseButton>
                        </div>
                        <Row gutter={[32, 32]}>
                            {displayFlashSales.slice(0, 4).map((product) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                    </section>
                )}

                {/* BEST SELLER - Banner tối nhưng chữ phải phản quang */}
                <section className="glass-effect" style={styles.bestSellerSection}>
                    <div style={styles.bestSellerHeader}>
                        <Space style={styles.ratingSpace}>
                            <StarFilled style={styles.starIcon} />
                            <Text style={styles.ratingText}>{HOME_STRINGS.bestSeller.topRated}</Text>
                            <StarFilled style={styles.starIcon} />
                        </Space>
                        <Title level={2} style={styles.bestSellerTitle}>
                            {HOME_STRINGS.bestSeller.title}
                        </Title>
                        <Text style={styles.bestSellerSubtitle}>
                            {HOME_STRINGS.bestSeller.description}
                        </Text>
                    </div>
                    {/* Dùng flexbox thay Row/Col vì Ant Design Grid chia 24 đơn vị không chia hết cho 5, gây xuống dòng */}
                    <div style={styles.bestSellerList} className="no-scrollbar">
                        {displayBestSellers.slice(0, 5).map((product) => (
                            <div
                                key={product.id}
                                className="premium-hover"
                                style={styles.bestSellerItem}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* BRANDS - Sidebar Layout */}
                {brandsData.map((brand, bIdx) => (
                    <section key={bIdx} style={styles.brandSection}>
                        <div style={styles.brandHeader}>
                            <Title level={2} style={styles.brandTitle}>
                                {brand.name}
                            </Title>
                            <div style={styles.brandLine}></div>
                            <BaseButton
                                onClick={() => navigate(`/products?brand=${brand.id}`)}
                                ghost
                                style={styles.brandDetailButton}
                            >
                                {HOME_STRINGS.brands.viewDetail}
                            </BaseButton>
                        </div>
                        <Row gutter={[32, 32]}>
                            {brand.products.map((product) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                    </section>
                ))}

                {/* CTN SECTION - Nâng cao chuyển đổi */}
                <section style={styles.ctaSection}>
                    <div style={styles.ctaContent}>
                        <Title style={styles.ctaTitle}>{HOME_STRINGS.cta.title}</Title>
                        <Text style={styles.ctaSubtitle}>
                            {HOME_STRINGS.cta.subtitle}
                        </Text>
                        <div style={styles.ctaForm}>
                            <div style={styles.ctaInputContainer}>
                                <Text style={styles.ctaInputPlaceholder}>
                                    {HOME_STRINGS.cta.emailPlaceholder}
                                </Text>
                            </div>
                            <BaseButton style={styles.ctaButton}>{HOME_STRINGS.cta.subscribeBtn}</BaseButton>
                        </div>
                    </div>
                    {/* Abstract Circle Decor */}
                    <div style={styles.ctaDecor}></div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
