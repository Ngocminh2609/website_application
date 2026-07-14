import type { CSSProperties } from "react";

export const styles = {
  bannerImage: {
    width: "150px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid var(--glass-border)",
  } as CSSProperties,

  titleText: {
    color: "var(--text-main)",
  } as CSSProperties,

  linkText: {
    color: "var(--text-muted)",
  } as CSSProperties,

  statusSelect: {
    width: 110,
  } as CSSProperties,

  container: {
    padding: "10px 0",
  } as CSSProperties,

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  } as CSSProperties,

  headerTitle: {
    color: "var(--text-main)",
    margin: 0,
  } as CSSProperties,

  headerSubtitle: {
    color: "var(--text-muted)",
    fontSize: 12,
  } as CSSProperties,

  inputNumberWidth: {
    width: "100%",
  } as CSSProperties,

  uploadButtonText: {
    marginTop: 8,
  } as CSSProperties,

  imageUrlInput: {
    height: 102,
  } as CSSProperties,
};
