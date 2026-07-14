import type { CSSProperties } from "react";

export const styles = {
  loadingContainer: {
    textAlign: "center",
    padding: "150px 0",
    minHeight: "100vh",
  } as CSSProperties,
  loadingText: {
    color: "var(--text-muted)",
    marginTop: "20px",
    display: "block",
  } as CSSProperties,
  layout: {
    background: "transparent",
    minHeight: "100vh",
    paddingTop: "100px",
  } as CSSProperties,
  breadcrumbLink: {
    color: "var(--text-muted)",
  } as CSSProperties,
  breadcrumbActive: {
    color: "var(--text-main)",
  } as CSSProperties,
  breadcrumbContainer: {
    marginBottom: "24px",
  } as CSSProperties,
  sidebarWrapper: {
    position: "sticky",
    top: "100px",
  } as CSSProperties,
  filterCardTitle: {
    margin: 0,
    color: "var(--text-main)",
  } as CSSProperties,
  filterCardBody: {
    padding: "24px",
  } as CSSProperties,
  fullWidthSpace: {
    width: "100%",
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
  sliderPriceRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
  } as CSSProperties,
  sliderPriceText: {
    color: "var(--primary-color)",
    fontWeight: 600,
  } as CSSProperties,
  headerRow: {
    marginBottom: "40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  } as CSSProperties,
  headerTitle: {
    color: "var(--text-main)",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  } as CSSProperties,
  headerSubtitle: {
    color: "var(--text-muted)",
    fontSize: "1.1rem",
  } as CSSProperties,
  emptyResultContainer: {
    padding: "100px 40px",
    textAlign: "center",
    background: "var(--glass-bg)",
    border: "1px solid var(--glass-border)",
    borderRadius: "32px",
  } as CSSProperties,
  emptyTitle: {
    color: "var(--text-main)",
    fontSize: "1.2rem",
    fontWeight: 600,
  } as CSSProperties,
  emptySubtitle: {
    color: "var(--text-muted)",
  } as CSSProperties,
};
