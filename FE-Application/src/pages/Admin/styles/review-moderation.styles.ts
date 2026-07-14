import type { CSSProperties } from "react";

export const styles = {
  avatar: {
    border: "1px solid rgba(255,255,255,0.1)",
  } as CSSProperties,

  fullName: {
    display: "block",
    color: "var(--text-main)",
  } as CSSProperties,

  createdAt: {
    fontSize: 11,
    color: "var(--text-muted)",
  } as CSSProperties,

  shopIcon: {
    color: "var(--primary-color)",
  } as CSSProperties,

  productId: {
    fontSize: 13,
  } as CSSProperties,

  rate: {
    fontSize: 12,
    marginBottom: 4,
  } as CSSProperties,

  comment: {
    color: "var(--text-main)",
    fontSize: 13,
    lineHeight: "1.4",
  } as CSSProperties,

  tagSpace: {
    marginTop: 8,
  } as CSSProperties,

  tag: {
    fontSize: 10,
    borderRadius: 4,
  } as CSSProperties,

  container: {
    padding: "10px 0",
  } as CSSProperties,

  header: {
    marginBottom: 24,
  } as CSSProperties,

  title: {
    color: "var(--text-main)",
    margin: 0,
  } as CSSProperties,

  subtitle: {
    color: "var(--text-muted)",
    fontSize: 12,
  } as CSSProperties,
};
