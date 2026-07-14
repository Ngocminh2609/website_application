import type { CSSProperties } from "react";

export const styles = {
  loadingContainer: {
    textAlign: "center",
    padding: "100px",
  } as CSSProperties,
  layout: {
    background: "transparent",
    minHeight: "100vh",
    paddingTop: "100px",
  } as CSSProperties,
  cardFilter: {
    borderRadius: "20px",
    border: "1px solid var(--glass-border)",
    padding: "10px",
  } as CSSProperties,
  cardFilterBody: {
    padding: "12px",
  } as CSSProperties,
  filterHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  } as CSSProperties,
  filterTitle: {
    margin: 0,
    color: "var(--text-main)",
  } as CSSProperties,
  filterSection: {
    marginBottom: "24px",
  } as CSSProperties,
  filterLabel: {
    display: "block",
    marginBottom: "12px",
    color: "var(--text-main)",
  } as CSSProperties,
  fullWidthSpace: {
    width: "100%",
  } as CSSProperties,
  priceRangeLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    color: "var(--text-muted)",
  } as CSSProperties,
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "30px",
  } as CSSProperties,
  pageTitle: {
    margin: 0,
    color: "var(--text-main)",
  } as CSSProperties,
  emptyResultContainer: {
    padding: "80px 0",
  } as CSSProperties,
  sidebarWrapper: {
    position: "sticky",
    top: "100px",
  } as CSSProperties,
  sidebarCard: {
    background: "var(--glass-bg)",
    border: "1px solid var(--glass-border)",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
  } as CSSProperties,
  sidebarCardBody: {
    padding: "24px",
  } as CSSProperties,
  sidebarCardHeader: {
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  } as CSSProperties,
  filterSectionTitle: {
    color: "var(--text-main)",
    display: "block",
    marginBottom: "15px",
  } as CSSProperties,
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  } as CSSProperties,
  sliderTrack: {
    backgroundColor: "var(--primary-color)",
  } as CSSProperties,
  sliderHandle: {
    borderColor: "var(--primary-color)",
    backgroundColor: "var(--primary-color)",
  } as CSSProperties,
  sliderPriceRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
  } as CSSProperties,
  sliderPriceText: {
    color: "var(--primary-color)",
    fontWeight: 600,
    fontSize: "0.95rem",
  } as CSSProperties,
  productListHeader: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as CSSProperties,
  productListTitle: {
    color: "var(--text-main)",
    margin: 0,
  } as CSSProperties,
  productListSubtitle: {
    color: "var(--text-muted)",
  } as CSSProperties,
  emptyResultBox: {
    padding: "100px",
    textAlign: "center",
    background: "var(--glass-bg)",
    borderRadius: "20px",
  } as CSSProperties,
  emptyResultText: {
    color: "var(--text-main)",
  } as CSSProperties,
};
