import type { CSSProperties } from "react";

export const styles = {
  loadingContainer: {
    padding: "100px 0",
    textAlign: "center",
  } as CSSProperties,
  loadingIcon: {
    fontSize: 48,
  } as CSSProperties,
  pageContainer: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "90px 20px 40px",
  } as CSSProperties,
  card: {
    boxShadow: "var(--card-shadow)",
    borderRadius: 16,
  } as CSSProperties,
  successIcon: {
    color: "#52c41a",
  } as CSSProperties,
  titleText: {
    color: "var(--text-main)",
  } as CSSProperties,
  subTitleText: {
    color: "var(--text-muted)",
  } as CSSProperties,
  detailCard: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--glass-border)",
    marginTop: 16,
  } as CSSProperties,
  detailCardInnerSpace: {
    width: "100%",
  } as CSSProperties,
  textMain: {
    color: "var(--text-main)",
  } as CSSProperties,
  textPrimaryHighlight: {
    color: "var(--primary-color)",
  } as CSSProperties,
  textRedHighlight: {
    color: "#ef4444",
  } as CSSProperties,
  failedIcon: {
    color: "#ff4d4f",
  } as CSSProperties,
  stepsSection: {
    marginTop: 40,
    padding: "0 20px",
  } as CSSProperties,
  stepsDivider: {
    borderColor: "var(--glass-border)",
    color: "var(--text-main)",
  } as CSSProperties,
  stepSpanText: {
    color: "var(--text-main)",
  } as CSSProperties,
  noteContainer: {
    marginTop: 24,
    padding: 16,
    background: "var(--bg-secondary)",
    borderRadius: 8,
    border: "1px solid var(--glass-border)",
  } as CSSProperties,
  noteText: {
    color: "var(--text-muted)",
  } as CSSProperties,
  actionButtonsContainer: {
    marginTop: 40,
    textAlign: "center",
  } as CSSProperties,
  btnPrimary: {
    borderRadius: 8,
    height: 48,
    padding: "0 32px",
    background: "var(--primary-color)",
    border: "none",
  } as CSSProperties,
  btnSecondary: {
    borderRadius: 8,
    height: 48,
    padding: "0 32px",
    background: "var(--glass-bg)",
    borderColor: "var(--glass-border)",
    color: "var(--text-main)",
  } as CSSProperties,
};
