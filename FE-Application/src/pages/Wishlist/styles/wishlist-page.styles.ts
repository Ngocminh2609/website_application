import type { CSSProperties } from "react";
import { WISHLIST_EMPTY_CARD_STYLE } from "../../../styles/commonStyles";

export const styles = {
  breadcrumb: {
    marginBottom: "24px",
  } as CSSProperties,
  breadcrumbActive: {
    color: "var(--text-main)",
  } as CSSProperties,
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
  } as CSSProperties,
  headerIcon: {
    fontSize: "36px",
    color: "#f43f5e",
  } as CSSProperties,
  headerTitle: {
    margin: 0,
    color: "var(--text-main)",
  } as CSSProperties,
  headerCount: {
    fontSize: "18px",
    marginLeft: "auto",
    color: "var(--text-muted)",
  } as CSSProperties,
  emptyCard: WISHLIST_EMPTY_CARD_STYLE as CSSProperties,
  emptyDescriptionWrapper: {
    marginTop: "24px",
  } as CSSProperties,
  emptyTitle: {
    fontSize: "20px",
    display: "block",
    marginBottom: "12px",
    color: "var(--text-main)",
    fontWeight: 600,
  } as CSSProperties,
  emptySubtitle: {
    color: "var(--text-muted)",
    fontSize: "16px",
  } as CSSProperties,
  continueShoppingBtn: {
    marginTop: "24px",
    borderRadius: "8px",
  } as CSSProperties,
  productCardWrapper: {
    position: "relative",
  } as CSSProperties,
  actionButtonsContainer: {
    position: "absolute",
    top: "12px",
    right: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    zIndex: 2,
  } as CSSProperties,
};
