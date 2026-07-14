import type { CSSProperties } from "react";

export const styles = {
  container: {
    padding: "20px 0",
  } as CSSProperties,

  headerTitle: {
    color: "var(--text-main)",
    marginBottom: "24px",
  } as CSSProperties,

  headerIcon: {
    marginRight: "8px",
  } as CSSProperties,

  formCard: {
    marginBottom: "32px",
  } as CSSProperties,

  formLabel: {
    color: "var(--text-main)",
  } as CSSProperties,

  formItemNoMargin: {
    marginBottom: 0,
  } as CSSProperties,

  submitButton: {
    width: "100%",
    height: "45px",
  } as CSSProperties,

  historyTitle: {
    color: "var(--text-main)",
    marginBottom: "16px",
  } as CSSProperties,

  historyCard: {
    marginBottom: "12px",
    border: "1px solid var(--glass-border)",
  } as CSSProperties,

  historyCardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  } as CSSProperties,

  historyMessage: {
    color: "var(--text-main)",
  } as CSSProperties,

  historyTime: {
    fontSize: "12px",
    color: "var(--text-muted)",
  } as CSSProperties,

  historyTimeWrapper: {
    marginTop: "8px",
  } as CSSProperties,

  emptyText: {
    color: "var(--text-muted)",
  } as CSSProperties,
};
