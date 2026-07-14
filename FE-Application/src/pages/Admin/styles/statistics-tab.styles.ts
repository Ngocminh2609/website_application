import type { CSSProperties } from "react";

export const styles = {
  container: {
    marginTop: 20,
  } as CSSProperties,

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  } as CSSProperties,

  headerTitle: {
    color: "var(--text-main)",
    margin: 0,
  } as CSSProperties,

  select: {
    width: 200,
  } as CSSProperties,

  spinnerContainer: {
    textAlign: "center",
    padding: "100px",
  } as CSSProperties,

  emptyText: {
    color: "var(--text-muted)",
  } as CSSProperties,

  cardTitleText: {
    color: "var(--text-main)",
  } as CSSProperties,

  cardBody: {
    padding: "24px 24px 40px 10px",
  } as CSSProperties,

  chartContainerRevenue: {
    width: "100%",
    height: 400,
  } as CSSProperties,

  chartContainerOrders: {
    width: "100%",
    height: 350,
  } as CSSProperties,

  tooltip: {
    backgroundColor: "var(--glass-bg)",
    border: "1px solid var(--glass-border)",
    borderRadius: "8px",
    color: "var(--text-main)",
  } as CSSProperties,

  tooltipItemRevenue: {
    color: "#6366f1",
  } as CSSProperties,

  tooltipItemOrders: {
    color: "#a855f7",
  } as CSSProperties,
};
