import React from "react";

export const styles = {
  // StarRating component styles
  ratingContainer: {
    display: "inline-flex",
    gap: 3,
    alignItems: "center",
    lineHeight: 0,
  },
  starWrapper: (size: number): React.CSSProperties => ({
    position: "relative",
    width: size,
    height: size,
    flexShrink: 0,
  }),
  starBackground: (size: number): React.CSSProperties => ({
    color: "rgba(255,255,255,0.1)",
    fontSize: size,
    position: "absolute",
    top: 0,
    left: 0,
    display: "block",
  }),
  starForegroundWrapper: (fillPercent: number): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: `${fillPercent}%`,
    overflow: "hidden",
    height: "100%",
    display: "block",
    transition: "width 0.3s ease",
  }),
  starForeground: (size: number): React.CSSProperties => ({
    color: "#fadb14",
    fontSize: size,
    width: size,
    display: "block",
  }),

  // ProductCard component styles
  coverWrapper: {
    position: "relative" as const,
    overflow: "hidden",
    height: "260px",
    background: "var(--bg-secondary)",
  },
  discountTagWrapper: {
    position: "absolute" as const,
    top: "12px",
    left: "12px",
    zIndex: 2,
  },
  discountTag: {
    borderRadius: "6px",
    fontWeight: 700,
    padding: "4px 8px",
    border: "none",
  },
  wishlistBtnWrapper: {
    position: "absolute" as const,
    top: "12px",
    right: "12px",
    zIndex: 3,
  },
  wishlistBtn: (isFav: boolean): React.CSSProperties => ({
    background: isFav ? "rgba(255,255,255,0.9)" : "var(--glass-bg)",
    border: "none",
    backdropFilter: "blur(4px)",
    color: isFav ? "#f43f5e" : "var(--text-main)",
  }),
  compareBtnWrapper: {
    position: "absolute" as const,
    top: "56px",
    right: "12px",
    zIndex: 3,
  },
  compareIcon: {
    transform: "rotate(90deg)",
  },
  compareBtn: (isComp: boolean): React.CSSProperties => ({
    background: isComp ? "var(--primary-color)" : "var(--glass-bg)",
    border: "none",
    backdropFilter: "blur(4px)",
    color: isComp ? "#fff" : "var(--text-main)",
    boxShadow: isComp ? "0 0 10px var(--primary-color)" : "none",
  }),
  bestSellerTagWrapper: {
    position: "absolute" as const,
    top: "12px",
    right: "12px",
    zIndex: 2,
  },
  bestSellerTag: {
    borderRadius: "6px",
    fontWeight: 700,
    padding: "4px 8px",
    border: "none",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    transition: "transform 0.5s ease",
  },
  brandRatingContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  ratingWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  reviewCount: {
    color: "var(--text-muted)",
    fontSize: "0.75rem",
  },
  footerContainer: {
    marginTop: "auto",
  },
  priceContainer: {
    display: "flex",
    alignItems: "baseline" as const,
    gap: "8px",
    marginBottom: "12px",
  },
  priceText: {
    margin: 0,
    color: "inherit",
    fontSize: "1.2rem",
    fontWeight: 700,
  },
  originalPriceText: {
    color: "var(--text-muted)",
    fontSize: "0.85rem",
  },
  actionsSpace: {
    width: "100%",
  },
  addCartBtn: {
    width: "100%",
    height: "42px",
    borderRadius: "10px",
    fontWeight: 600,
  },
  viewDetailBtnWrapper: {
    width: "100%",
  },
  viewDetailBtn: {
    width: "100%",
    height: "42px",
    borderRadius: "10px",
    fontWeight: 600,
    background: "var(--glass-bg)",
    borderColor: "var(--glass-border)",
    color: "var(--text-main)",
  },
};
