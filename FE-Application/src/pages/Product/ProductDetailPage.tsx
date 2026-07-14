import React from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Typography,
  Tag,
  Rate,
  Space,
  Divider,
  Spin,
  Empty,
  Breadcrumb,
  Image,
  Avatar,
  Progress,
} from "antd";
import {
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  RocketOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
  UserOutlined,
  DeleteOutlined,
  StarFilled,
} from "@ant-design/icons";
import { StarRating } from "../../components/common/ProductCard";
import { useProductDetailPage } from "../../hooks/Product/useProductDetailPage";
import BaseButton from "../../components/common/BaseButton";
import BaseInput from "../../components/common/BaseInput";
import { ROLES } from "../../components/common/Roles";
import PersonalizedRecommendations from "../../components/common/PersonalizedRecommendations";
import RealTimeViewerCount from "../../components/product/RealTimeViewerCount";
import { useCompare } from "../../hooks/Product/useCompare";
import {
  getProductAllImages,
  getSpecsList,
  getDiscountPercent,
} from "./helper";
import { styles } from "./styles/product-detail.styles";
import { PRODUCT_STRINGS } from "../../constants/Product/product";

/**
 * Trang chi tiết sản phẩm cao cấp.
 * Hiển thị đầy đủ thông tin, thông số kỹ thuật và bộ sưu tập ảnh.
 */
const ProductDetailPage: React.FC = () => {
  const {
    product,
    loading,
    mainImage,
    setMainImage,
    reviews,
    reviewLoading,
    submitLoading,
    userRating,
    setUserRating,
    userComment,
    setUserComment,
    currentUser,
    imageContainerRef,
    handleAddToCart,
    handleSubmitReview,
    handleDeleteReview,
    ratingDistribution,
    avgRating,
  } = useProductDetailPage();

  const { addToCompare, removeFromCompare, isComparing } = useCompare();
  const strings = PRODUCT_STRINGS.detailPage;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.notFoundContainer}>
        <Empty
          description={
            <span style={styles.notFoundText}>
              {strings.notFound}
            </span>
          }
        />
        <Link to="/products">
          <BaseButton
            icon={<ArrowLeftOutlined />}
            style={styles.backToStoreBtn}
          >
            {strings.backToStore}
          </BaseButton>
        </Link>
      </div>
    );
  }

  const allImages = getProductAllImages(product.imageUrl, product.moreImages);
  const specs = getSpecsList(product.specifications);
  const discountPercent = getDiscountPercent(
    product.discountPercent,
    product.originalPrice,
    product.price,
  );

  return (
    <Layout style={styles.layout}>
      <div className="main-content">
        {/* Breadcrumb hiện đại */}
        <Breadcrumb
          items={[
            {
              title: (
                <Link to="/" style={styles.breadcrumbLinkText}>
                  Trang chủ
                </Link>
              ),
            },
            {
              title: (
                <Link to="/products" style={styles.breadcrumbLinkText}>
                  Sản phẩm
                </Link>
              ),
            },
            {
              title: (
                <span style={styles.breadcrumbActiveText}>
                  {product.name}
                </span>
              ),
            },
          ]}
          style={styles.breadcrumbContainer}
        />

        <Row gutter={[48, 48]} style={styles.detailRow}>
          {/* KHỐI HÌNH ẢNH */}
          <Col xs={24} lg={12}>
            <div style={styles.stickyGallery}>
              {/* Ảnh chính lớn */}
              <div ref={imageContainerRef} style={styles.mainImageWrapper}>
                <Image
                  src={mainImage}
                  alt={product.name}
                  style={styles.mainImage}
                  preview={{ mask: "Xem phóng to" }}
                />
              </div>

              {/* Danh sách ảnh nhỏ (Gallery) */}
              {allImages.length > 1 && (
                <Row gutter={[12, 12]}>
                  {allImages.map((img, idx) => (
                    <Col span={6} key={idx}>
                      <div
                        onClick={() => setMainImage(img)}
                        style={styles.thumbnailWrapper(mainImage === img)}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${idx}`}
                          style={styles.thumbnailImage}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Col>

          {/* KHỐI THÔNG TIN CHI TIẾT */}
          <Col xs={24} lg={12}>
            <div style={styles.infoSection}>
              <Space direction="vertical" size="middle" style={styles.fullWidthSpace}>
                {/* Nhãn hiệu & Huy hiệu */}
                <Space
                  split={
                    <Divider
                      type="vertical"
                      style={styles.divider}
                    />
                  }
                >
                  <Typography.Text style={styles.brandText}>
                    {product.brand || "NO BRAND"}
                  </Typography.Text>
                  <Tag
                    color="blue"
                    bordered={false}
                    style={styles.badgeTag}
                  >
                    CHÍNH HÃNG
                  </Tag>
                  {product.isBestSeller && (
                    <Tag
                      color="gold"
                      bordered={false}
                      style={styles.badgeTag}
                    >
                      BÁN CHẠY
                    </Tag>
                  )}
                </Space>

                <RealTimeViewerCount productId={product.id} />

                <Typography.Title level={1} style={styles.productTitle}>
                  {product.name}
                </Typography.Title>

                {/* Rating */}
                <Space size="large" style={styles.ratingSpace}>
                  <StarRating value={parseFloat(avgRating)} size={20} />
                  <Typography.Text style={styles.mutedText}>
                    ( {reviews.length} đánh giá từ người dùng )
                  </Typography.Text>
                </Space>

                {/* Giá cả */}
                <div style={styles.priceContainer}>
                  <Space align="baseline" size="middle">
                    <Typography.Title level={2} style={styles.priceTitle}>
                      {product.price?.toLocaleString("vi-VN")} ₫
                    </Typography.Title>
                    {product.originalPrice && (
                      <Typography.Text delete style={styles.originalPriceText}>
                        {product.originalPrice?.toLocaleString("vi-VN")} ₫
                      </Typography.Text>
                    )}
                    {discountPercent > 0 && (
                      <Tag
                        color="red"
                        bordered={false}
                        style={styles.discountTag}
                      >
                        -{discountPercent}%
                      </Tag>
                    )}
                  </Space>
                </div>

                {/* Ưu đãi đi kèm */}
                <div style={styles.warrantySection}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Space>
                        <RocketOutlined style={styles.iconPrimaryColor} />
                        <Typography.Text style={styles.textMainColor}>
                          {strings.warrantyItem3}
                        </Typography.Text>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space>
                        <SafetyCertificateOutlined style={styles.iconPrimaryColor} />
                        <Typography.Text style={styles.textMainColor}>
                          {strings.warrantyItem1}
                        </Typography.Text>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space>
                        <SwapOutlined style={styles.iconPrimaryColor} />
                        <Typography.Text style={styles.textMainColor}>
                          {strings.warrantyItem2}
                        </Typography.Text>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space>
                        <CheckCircleFilled style={styles.iconPrimaryColor} />
                        <Typography.Text style={styles.textMainColor}>
                          {strings.warrantyTitle}
                        </Typography.Text>
                      </Space>
                    </Col>
                  </Row>
                </div>

                <Divider style={styles.divider} />

                {/* Mô tả ngắn */}
                <div>
                  <Typography.Title level={5} style={styles.specsBriefTitle}>
                    {strings.descriptionTitle}
                  </Typography.Title>
                  <Typography.Paragraph style={styles.specsBriefParagraph}>
                    {product.description}
                  </Typography.Paragraph>
                </div>

                {/* Nút hành động */}
                <div style={styles.actionButtonsWrapper}>
                  <Row gutter={16}>
                    <Col span={16}>
                      <BaseButton
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={handleAddToCart}
                        style={styles.addToCartBtn}
                      >
                        {strings.addToCart}
                      </BaseButton>
                    </Col>
                    <Col span={8}>
                      <BaseButton
                        onClick={() =>
                          isComparing(product.id)
                            ? removeFromCompare(product.id)
                            : addToCompare(product)
                        }
                        style={styles.compareBtn(isComparing(product.id))}
                      >
                        {isComparing(product.id) ? "XÓA SO SÁNH" : "SO SÁNH"}
                      </BaseButton>
                    </Col>
                  </Row>
                </div>
              </Space>
            </div>
          </Col>
        </Row>

        {/* THÔNG SỐ KỸ THUẬT & REVIEW */}
        <div style={styles.tabSectionWrapper}>
          <Row gutter={[48, 48]}>
            {/* THÔNG SỐ KỸ THUẬT */}
            <Col xs={24} md={12}>
              <Typography.Title level={3} style={styles.specsDetailedTitle}>
                {strings.specsTitle}
              </Typography.Title>
              {specs.length > 0 ? (
                <div style={styles.specsTable}>
                  {specs.map((spec, index) => {
                    const [label, ...valueParts] = spec.split(":");
                    const value = valueParts.join(":");
                    return (
                      <div key={index} style={styles.specsTableRow}>
                        <Typography.Text style={styles.specLabel}>
                          {label.trim()}
                        </Typography.Text>
                        <Typography.Text style={styles.specValue}>
                          {value ? value.trim() : ""}
                        </Typography.Text>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Typography.Text style={styles.mutedText}>
                  Đang cập nhật thông tin...
                </Typography.Text>
              )}
            </Col>

            {/* ĐÁNH GIÁ SẢN PHẨM */}
            <Col xs={24} md={12}>
              <Typography.Title level={3} style={styles.specsDetailedTitle}>
                {strings.customerReviewsTitle}
              </Typography.Title>

              {/* Tổng quan rating */}
              <div style={styles.ratingOverviewCard}>
                <Row gutter={24} align="middle">
                  <Col xs={8} style={{ textAlign: "center" }}>
                    <div style={styles.avgRatingNumber}>
                      {avgRating}
                    </div>
                    <StarRating value={parseFloat(avgRating)} size={14} />
                    <div style={styles.reviewCountText}>
                      {reviews.length} đánh giá
                    </div>
                  </Col>
                  <Col xs={16}>
                    {ratingDistribution.map(({ star, count, percent }) => (
                      <div key={star} style={styles.distributionRow}>
                        <Typography.Text style={styles.distributionStarText}>
                          {star}
                        </Typography.Text>
                        <StarFilled style={styles.distributionStarIcon} />
                        <Progress
                          percent={percent}
                          showInfo={false}
                          strokeColor="#fadb14"
                          trailColor="var(--glass-border)"
                          style={styles.distributionProgress}
                        />
                        <Typography.Text style={styles.distributionCountText}>
                          {count}
                        </Typography.Text>
                      </div>
                    ))}
                  </Col>
                </Row>
              </div>

              {/* Form gửi đánh giá */}
              {currentUser ? (
                <div style={styles.writeReviewCard}>
                  <Typography.Text style={styles.writeReviewTitle}>
                    {strings.yourReviewTitle}
                  </Typography.Text>
                  <Rate
                    value={userRating}
                    onChange={setUserRating}
                    style={{ marginBottom: 12 }}
                  />
                  <BaseInput
                    placeholder={strings.reviewPlaceholder}
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    style={{ marginBottom: 12 }}
                  />
                  <BaseButton
                    type="primary"
                    onClick={handleSubmitReview}
                    loading={submitLoading}
                    style={{ width: "100%" }}
                  >
                    {strings.submitReviewBtn}
                  </BaseButton>
                </div>
              ) : (
                <div style={styles.loginPromptContainer}>
                  <Typography.Text style={styles.mutedText}>
                    <Link to="/login" style={{ color: "var(--primary-color)" }}>
                      Đăng nhập
                    </Link>{" "}
                    để viết đánh giá
                  </Typography.Text>
                </div>
              )}

              {/* Danh sách review */}
              {reviewLoading ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <Spin />
                </div>
              ) : reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: 24 }}>
                  <Typography.Text style={styles.mutedText}>
                    Chưa có đánh giá nào. Hãy là người đầu tiên!
                  </Typography.Text>
                </div>
              ) : (
                <div style={styles.reviewsListWrapper}>
                  {reviews.map((review) => (
                    <div key={review.id} style={styles.reviewItem}>
                      <div style={styles.reviewHeader}>
                        <Space>
                          <Avatar
                            src={review.user.avatarUrl}
                            icon={<UserOutlined />}
                            size={36}
                          />
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <Typography.Text style={styles.reviewUserFullname}>
                                {review.user.fullName || review.user.username}
                              </Typography.Text>
                              {review.isVerifiedPurchase && (
                                <Tag
                                  color="green"
                                  bordered={false}
                                  style={styles.reviewVerifiedBadge}
                                >
                                  <CheckCircleFilled /> Đã mua
                                </Tag>
                              )}
                            </div>
                            <StarRating value={review.rating} size={12} />
                          </div>
                        </Space>
                        <Space>
                          <Typography.Text style={styles.reviewDate}>
                            {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                          </Typography.Text>
                          {(currentUser?.id === review.user.id ||
                            currentUser?.role === ROLES.ADMIN) && (
                              <DeleteOutlined
                                style={styles.reviewDeleteIcon}
                                onClick={() => handleDeleteReview(review.id)}
                              />
                            )}
                        </Space>
                      </div>
                      {review.comment && (
                        <Typography.Paragraph style={styles.reviewCommentText}>
                          {review.comment}
                        </Typography.Paragraph>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </div>

        {/* GỢI Ý CÁ NHÂN HÓA */}
        <PersonalizedRecommendations
          title="Có Thể Bạn Cũng Thích"
          description="Sản phẩm được gợi ý riêng dựa trên lịch sử xem của bạn."
          limit={5}
        />
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
