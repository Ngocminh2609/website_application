import type { CSSProperties } from "react";

export const styles = {
  imageWrapper: {
    position: "relative",
  } as CSSProperties,

  productImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    objectFit: "cover",
    border: "1px solid rgba(255,255,255,0.1)",
  } as CSSProperties,

  bestSellerFire: {
    position: "absolute",
    top: -5,
    right: -5,
    color: "#ff4d4f",
    fontSize: 16,
  } as CSSProperties,

  productNameText: {
    display: "block",
    fontSize: "15px",
    color: "var(--text-main)",
  } as CSSProperties,

  tagBrandAndCategory: {
    borderRadius: 4,
    margin: 0,
  } as CSSProperties,

  productPrice: {
    display: "block",
    color: "var(--primary-color)",
  } as CSSProperties,

  originalPrice: {
    fontSize: 11,
  } as CSSProperties,

  inactiveTag: {
    fontSize: 10,
    marginTop: 4,
  } as CSSProperties,

  orderContactSubtext: {
    fontSize: "12px",
  } as CSSProperties,

  orderTotalAmount: {
    color: "var(--primary-color)",
  } as CSSProperties,

  deliveredStatusButton: {
    background: "#52c41a",
    border: "none",
  } as CSSProperties,

  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px",
  } as CSSProperties,

  headerTitle: {
    color: "var(--text-main)",
    margin: 0,
  } as CSSProperties,

  headerSubtitle: {
    color: "var(--text-muted)",
    fontSize: "15px",
  } as CSSProperties,

  ordersCountHighlight: {
    color: "var(--primary-color)",
  } as CSSProperties,

  rowMargin: {
    marginBottom: "40px",
  } as CSSProperties,

  cardBody: {
    padding: "24px",
  } as CSSProperties,

  cardTitleIconText: {
    color: "var(--text-muted)",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as CSSProperties,

  cardTitleValue: {
    margin: 0,
    color: "var(--text-main)",
    fontWeight: 800,
  } as CSSProperties,

  cardTitleRevenueValue: {
    margin: 0,
    color: "var(--primary-hover)",
    fontWeight: 800,
  } as CSSProperties,

  cardSubText: {
    fontSize: 16,
    color: "var(--text-muted)",
    fontWeight: 400,
  } as CSSProperties,

  tabLabelText: {
    fontSize: 16,
    color: "var(--text-main)",
  } as CSSProperties,

  tableActionsContainer: {
    textAlign: "right",
    marginBottom: 20,
  } as CSSProperties,

  modalTitle: {
    margin: 0,
  } as CSSProperties,

  modalStyle: {
    top: 110,
  } as CSSProperties,

  modalBody: {
    maxHeight: "calc(100vh - 270px)",
    overflowY: "auto",
    overflowX: "hidden",
    paddingRight: "8px",
  } as CSSProperties,

  formContainer: {
    marginTop: "20px",
  } as CSSProperties,

  inputNumberWidth: {
    width: "100%",
  } as CSSProperties,

  discountPreview: {
    background: "var(--bg-secondary)",
    padding: "12px 16px",
    borderRadius: 12,
    marginTop: 30,
    border: "1px dashed var(--primary-color)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as CSSProperties,

  discountPrice: {
    color: "var(--primary-color)",
    fontSize: 18,
  } as CSSProperties,

  uploadButtonText: {
    marginTop: 8,
  } as CSSProperties,

  imageUrlInput: {
    height: 102,
  } as CSSProperties,
};
