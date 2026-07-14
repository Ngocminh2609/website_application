import type { CSSProperties } from "react";

export const styles = {
  loadingContainer: {
    textAlign: "center",
    padding: "150px",
  } as CSSProperties,
  notFoundContainer: {
    textAlign: "center",
    padding: "100px",
  } as CSSProperties,
  notFoundText: {
    color: "var(--text-main)",
  } as CSSProperties,
  backToStoreBtn: {
    marginTop: "20px",
  } as CSSProperties,
  layout: {
    background: "transparent",
    minHeight: "100vh",
    paddingTop: "100px",
  } as CSSProperties,
  breadcrumbContainer: {
    marginBottom: "30px",
  } as CSSProperties,
  breadcrumbActiveText: {
    color: "var(--text-main)",
  } as CSSProperties,
  breadcrumbLinkText: {
    color: "var(--text-muted)",
  } as CSSProperties,
  detailRow: {
    marginBottom: "60px",
  } as CSSProperties,
  stickyGallery: {
    position: "sticky",
    top: "120px",
  } as CSSProperties,
  mainImageWrapper: {
    background: "var(--glass-bg)",
    padding: "20px",
    borderRadius: "24px",
    border: "1px solid var(--glass-border)",
    marginBottom: "20px",
    overflow: "hidden",
  } as CSSProperties,
  mainImage: {
    width: "100%",
    height: "auto",
    borderRadius: "16px",
    objectFit: "contain",
  } as CSSProperties,
  thumbnailWrapper: (isActive: boolean) => ({
    cursor: "pointer",
    border: isActive
      ? "2px solid var(--primary-color)"
      : "1px solid var(--glass-border)",
    borderRadius: "12px",
    padding: "5px",
    background: "rgba(255,255,255,0.02)",
    transition: "all 0.3s ease",
  }) as CSSProperties,
  thumbnailImage: {
    width: "100%",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
  } as CSSProperties,
  infoSection: {
    color: "#fff",
  } as CSSProperties,
  fullWidthSpace: {
    width: "100%",
  } as CSSProperties,
  brandText: {
    color: "var(--primary-color)",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "2px",
  } as CSSProperties,
  badgeTag: {
    borderRadius: "4px",
    fontWeight: 600,
  } as CSSProperties,
  productTitle: {
    color: "var(--text-main)",
    fontSize: "2.5rem",
    marginBottom: "8px",
  } as CSSProperties,
  ratingSpace: {
    marginBottom: "10px",
  } as CSSProperties,
  mutedText: {
    color: "var(--text-muted)",
  } as CSSProperties,
  priceContainer: {
    background: "rgba(99, 102, 241, 0.05)",
    padding: "24px",
    borderRadius: "16px",
    borderLeft: "4px solid var(--primary-color)",
  } as CSSProperties,
  priceTitle: {
    color: "var(--text-main)",
    margin: 0,
    fontSize: "2rem",
  } as CSSProperties,
  originalPriceText: {
    color: "var(--text-muted)",
    fontSize: "1.2rem",
  } as CSSProperties,
  discountTag: {
    fontSize: "1rem",
    padding: "4px 8px",
  } as CSSProperties,
  warrantySection: {
    margin: "20px 0",
  } as CSSProperties,
  iconPrimaryColor: {
    color: "var(--primary-color)",
  } as CSSProperties,
  textMainColor: {
    color: "var(--text-main)",
  } as CSSProperties,
  divider: {
    borderColor: "var(--glass-border)",
  } as CSSProperties,
  specsBriefTitle: {
    color: "var(--text-main)",
  } as CSSProperties,
  specsBriefParagraph: {
    color: "var(--text-muted)",
    fontSize: "1rem",
    lineHeight: "1.8",
  } as CSSProperties,
  actionButtonsWrapper: {
    marginTop: "20px",
  } as CSSProperties,
  addToCartBtn: {
    width: "100%",
    height: "54px",
    fontSize: "1.1rem",
    borderRadius: "12px",
    fontWeight: 700,
  } as CSSProperties,
  compareBtn: (isActive: boolean) => ({
    width: "100%",
    height: "54px",
    borderRadius: "12px",
    borderColor: isActive ? "#ff4d4f" : "var(--primary-color)",
    color: isActive ? "#ff4d4f" : "var(--primary-color)",
    background: isActive ? "rgba(255, 77, 79, 0.1)" : "transparent",
  }) as CSSProperties,
  tabSectionWrapper: {
    background: "var(--glass-bg)",
    borderRadius: "24px",
    padding: "40px",
    border: "1px solid var(--glass-border)",
    marginBottom: "80px",
  } as CSSProperties,
  specsDetailedTitle: {
    color: "var(--text-main)",
    marginBottom: "30px",
  } as CSSProperties,
  specsTable: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  } as CSSProperties,
  specsTableRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid var(--glass-border)",
  } as CSSProperties,
  specLabel: {
    color: "var(--text-muted)",
    fontWeight: 500,
  } as CSSProperties,
  specValue: {
    color: "var(--text-main)",
    fontWeight: 600,
  } as CSSProperties,
  ratingOverviewCard: {
    background: "var(--bg-secondary)",
    borderRadius: 16,
    padding: "24px",
    marginBottom: 24,
  } as CSSProperties,
  avgRatingNumber: {
    fontSize: "3rem",
    fontWeight: 800,
    color: "var(--text-main)",
    lineHeight: 1,
  } as CSSProperties,
  reviewCountText: {
    color: "var(--text-muted)",
    fontSize: 12,
    marginTop: 4,
  } as CSSProperties,
  distributionRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  } as CSSProperties,
  distributionStarText: {
    color: "var(--text-muted)",
    fontSize: 12,
    width: 10,
  } as CSSProperties,
  distributionStarIcon: {
    color: "#fadb14",
    fontSize: 12,
  } as CSSProperties,
  distributionProgress: {
    flex: 1,
    margin: 0,
  } as CSSProperties,
  distributionCountText: {
    color: "var(--text-muted)",
    fontSize: 12,
    width: 20,
  } as CSSProperties,
  writeReviewCard: {
    background: "rgba(99,102,241,0.05)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  } as CSSProperties,
  writeReviewTitle: {
    color: "var(--text-main)",
    display: "block",
    marginBottom: 12,
    fontWeight: 600,
  } as CSSProperties,
  loginPromptContainer: {
    textAlign: "center",
    padding: "16px",
    marginBottom: 16,
  } as CSSProperties,
  reviewsListWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  } as CSSProperties,
  reviewItem: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    padding: "16px 20px",
    border: "1px solid rgba(255,255,255,0.05)",
  } as CSSProperties,
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  } as CSSProperties,
  reviewUserFullname: {
    color: "var(--text-main)",
    fontWeight: 600,
  } as CSSProperties,
  reviewVerifiedBadge: {
    fontSize: 11,
    padding: "0 6px",
  } as CSSProperties,
  reviewDate: {
    color: "var(--text-muted)",
    fontSize: 12,
  } as CSSProperties,
  reviewDeleteIcon: {
    color: "#ef4444",
    cursor: "pointer",
    fontSize: 14,
  } as CSSProperties,
  reviewCommentText: {
    color: "var(--text-muted)",
    margin: "10px 0 0 44px",
    fontSize: 14,
  } as CSSProperties,
};
