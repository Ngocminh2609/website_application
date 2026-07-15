import type { CSSProperties } from "react";

export const filterSidebarStyles = {
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
  filterTitle: {
    margin: 0,
    color: "var(--text-main)",
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
  checkboxLabel: {
    color: "var(--text-muted)",
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
};
