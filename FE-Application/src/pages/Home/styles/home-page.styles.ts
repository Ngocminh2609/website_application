import type { CSSProperties } from "react";

export const styles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "transparent",
  } as CSSProperties,

  loadingText: {
    color: "var(--text-main)",
  } as CSSProperties,

  pageContainer: {
    color: "var(--text-main)",
  } as CSSProperties,

  heroSection: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    padding: "80px 0",
    background:
      "radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)",
  } as CSSProperties,

  heroTitle: {
    color: "var(--text-main)",
    marginBottom: "24px",
    textShadow: "0 4px 12px rgba(0,0,0,0.1)",
  } as CSSProperties,

  primaryColorText: {
    color: "var(--primary-color)",
  } as CSSProperties,

  heroParagraph: {
    color: "var(--text-muted)",
    fontSize: "1.25rem",
    marginBottom: "48px",
    lineHeight: 1.8,
    maxWidth: "600px",
  } as CSSProperties,

  exploreButton: {
    height: "64px",
    padding: "0 48px",
    fontSize: "1.1rem",
    borderRadius: "16px",
    fontWeight: 700,
  } as CSSProperties,

  offerButton: {
    height: "64px",
    padding: "0 48px",
    fontSize: "1.1rem",
    borderRadius: "16px",
    borderColor: "var(--text-main)",
    color: "var(--text-main)",
  } as CSSProperties,

  statsContainer: {
    marginTop: "60px",
    display: "flex",
    gap: "40px",
  } as CSSProperties,

  statsNumber: {
    color: "var(--text-main)",
    margin: 0,
  } as CSSProperties,

  statsLabel: {
    color: "var(--text-muted)",
  } as CSSProperties,

  statsDivider: {
    height: "40px",
    borderColor: "var(--glass-border)",
  } as CSSProperties,

  carouselWrapper: {
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "var(--card-shadow)",
    border: "1px solid var(--glass-border)",
  } as CSSProperties,

  carouselItemContainer: (hasLink: boolean): CSSProperties => ({
    cursor: hasLink ? "pointer" : "default",
  }),

  carouselItemInner: (imageUrl: string): CSSProperties => ({
    height: "420px",
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.7) 100%), url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "24px",
    display: "flex",
    alignItems: "flex-end",
    padding: "30px 40px",
    position: "relative",
  }),

  carouselTitle: {
    color: "#ffffff",
    margin: 0,
    textShadow: "0 2px 10px rgba(0,0,0,0.6)",
    fontWeight: 700,
  } as CSSProperties,

  categoryNavContainer: {
    marginBottom: "100px",
    textAlign: "center",
  } as CSSProperties,

  categoryNavSub: {
    color: "var(--primary-color)",
    textTransform: "uppercase",
    fontSize: "0.9rem",
    fontWeight: 800,
    letterSpacing: "3px",
    marginBottom: "20px",
    display: "block",
  } as CSSProperties,

  categoryList: {
    display: "flex",
    overflowX: "auto",
    gap: "24px",
    padding: "10px 0 30px",
  } as CSSProperties,

  categoryItem: {
    padding: "18px 40px",
    background: "var(--glass-bg)",
    border: "1px solid var(--glass-border)",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
  } as CSSProperties,

  categoryItemText: {
    color: "var(--text-main)",
    fontWeight: 600,
    fontSize: "1.05rem",
  } as CSSProperties,

  flashSalesSection: {
    marginBottom: "120px",
  } as CSSProperties,

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "50px",
  } as CSSProperties,

  sectionTitleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  } as CSSProperties,

  flashIconWrapper: {
    background: "#ef4444",
    padding: "10px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
  } as CSSProperties,

  flashIcon: {
    color: "#fff",
    fontSize: "24px",
  } as CSSProperties,

  sectionTitle: {
    color: "var(--text-main)",
    margin: 0,
  } as CSSProperties,

  flashTimer: {
    color: "#ef4444",
    fontWeight: 600,
  } as CSSProperties,

  viewAllButton: {
    color: "var(--primary-color)",
    fontSize: "1rem",
  } as CSSProperties,

  bestSellerSection: {
    marginBottom: "120px",
    padding: "80px 60px",
    borderRadius: "48px",
    boxShadow: "var(--card-shadow)",
  } as CSSProperties,

  bestSellerHeader: {
    textAlign: "center",
    marginBottom: "60px",
  } as CSSProperties,

  ratingSpace: {
    marginBottom: "15px",
  } as CSSProperties,

  starIcon: {
    color: "#fcd34d",
  } as CSSProperties,

  ratingText: {
    color: "#fcd34d",
    fontWeight: 600,
    letterSpacing: "2px",
  } as CSSProperties,

  bestSellerTitle: {
    color: "var(--text-main)",
    fontSize: "3rem",
    fontWeight: 800,
    margin: 0,
  } as CSSProperties,

  bestSellerSubtitle: {
    color: "var(--text-muted)",
    fontSize: "1.2rem",
    marginTop: "10px",
    display: "block",
  } as CSSProperties,

  bestSellerList: {
    display: "flex",
    gap: "32px",
    flexWrap: "nowrap",
    overflowX: "auto",
  } as CSSProperties,

  bestSellerItem: {
    flex: "0 0 calc(20% - 26px)",
    minWidth: "220px",
  } as CSSProperties,

  brandSection: {
    marginBottom: "100px",
  } as CSSProperties,

  brandHeader: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "48px",
  } as CSSProperties,

  brandTitle: {
    color: "var(--text-main)",
    margin: 0,
    whiteSpace: "nowrap",
  } as CSSProperties,

  brandLine: {
    flex: 1,
    height: "1px",
    background:
      "linear-gradient(90deg, var(--glass-border) 0%, transparent 100%)",
  } as CSSProperties,

  brandDetailButton: {
    borderColor: "var(--primary-color)",
    color: "var(--primary-color)",
    fontWeight: 600,
  } as CSSProperties,

  ctaSection: {
    marginTop: "150px",
    padding: "100px 40px",
    background: "var(--primary-gradient)",
    borderRadius: "48px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  } as CSSProperties,

  ctaContent: {
    position: "relative",
    zIndex: 2,
  } as CSSProperties,

  ctaTitle: {
    color: "#ffffff",
    fontSize: "3.5rem",
    fontWeight: 900,
    marginBottom: "24px",
  } as CSSProperties,

  ctaSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "1.4rem",
    display: "block",
    marginBottom: "48px",
    maxWidth: "800px",
    margin: "0 auto 48px",
  } as CSSProperties,

  ctaForm: {
    display: "flex",
    maxWidth: "650px",
    margin: "0 auto",
    gap: "16px",
    flexWrap: "wrap",
    justifyContent: "center",
  } as CSSProperties,

  ctaInputContainer: {
    flex: 1,
    minWidth: "300px",
    height: "64px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
  } as CSSProperties,

  ctaInputPlaceholder: {
    color: "rgba(255,255,255,0.8)",
  } as CSSProperties,

  ctaButton: {
    height: "64px",
    padding: "0 48px",
    borderRadius: "18px",
    background: "#ffffff",
    color: "var(--primary-color)",
    fontWeight: 800,
    border: "none",
    fontSize: "1.1rem",
  } as CSSProperties,

  ctaDecor: {
    position: "absolute",
    top: "-100px",
    left: "-100px",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    filter: "blur(50px)",
  } as CSSProperties,
};
