import type { CSSProperties } from "react";

export const styles = {
  tagCode: {
    fontWeight: 700,
    padding: "4px 10px",
    fontSize: 13,
  } as CSSProperties,

  usageWrapper: {
    width: 100,
  } as CSSProperties,

  usageProgressLabel: {
    fontSize: 11,
    marginBottom: 4,
    display: "flex",
    justifyContent: "space-between",
    color: "var(--text-muted)",
  } as CSSProperties,

  progressBarBg: {
    height: 4,
    background: "var(--glass-border)",
    borderRadius: 2,
  } as CSSProperties,

  progressBarFill: (percent: number): CSSProperties => ({
    height: "100%",
    width: `${percent}%`,
    background: "var(--primary-color)",
    borderRadius: 2,
  }),

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

  inputCode: {
    textTransform: "uppercase",
  } as CSSProperties,

  inputNumberWidth: {
    width: "100%",
  } as CSSProperties,
};
