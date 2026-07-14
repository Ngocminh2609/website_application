import type { CSSProperties } from "react";

export const styles = {
  emptyCartCard: {
    textAlign: "center",
    padding: "50px",
  } as CSSProperties,

  emptyCartIcon: {
    fontSize: 64,
    color: "var(--primary-color)",
  } as CSSProperties,

  emptyCartText: {
    color: "var(--text-muted)",
  } as CSSProperties,

  tableCardBody: (isMobile: boolean): CSSProperties => ({
    padding: isMobile ? "10px" : "24px",
  }),

  billingTitle: {
    color: "var(--text-main)",
  } as CSSProperties,

  fullWidth: {
    width: "100%",
  } as CSSProperties,

  spaceBetween: {
    display: "flex",
    justifyContent: "space-between",
  } as CSSProperties,

  billingLabel: {
    color: "var(--text-muted)",
  } as CSSProperties,

  billingValue: {
    color: "var(--text-main)",
  } as CSSProperties,

  couponLabel: {
    color: "var(--text-muted)",
    display: "block",
    marginBottom: 8,
  } as CSSProperties,

  couponSuccessWrapper: {
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.4)",
    borderRadius: 10,
    padding: "10px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as CSSProperties,

  couponSuccessText: {
    color: "#22c55e",
    fontWeight: 600,
  } as CSSProperties,

  couponSuccessSubtext: {
    color: "#22c55e",
    fontSize: 12,
  } as CSSProperties,

  couponMaxText: {
    fontSize: "10px",
    marginLeft: 4,
  } as CSSProperties,

  couponSuccessClose: {
    color: "#22c55e",
    cursor: "pointer",
  } as CSSProperties,

  couponInput: {
    textTransform: "uppercase",
  } as CSSProperties,

  couponErrorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
    display: "block",
  } as CSSProperties,

  discountLabel: {
    color: "#22c55e",
  } as CSSProperties,

  discountValue: {
    color: "#22c55e",
    fontWeight: 600,
  } as CSSProperties,

  totalDivider: {
    borderTop: "1px solid var(--glass-border)",
    paddingTop: "16px",
    display: "flex",
    justifyContent: "space-between",
  } as CSSProperties,

  totalLabel: {
    color: "var(--text-main)",
    fontSize: "18px",
  } as CSSProperties,

  totalValue: {
    color: "var(--primary-color)",
    fontSize: "24px",
  } as CSSProperties,

  paymentButton: {
    width: "100%",
    height: "50px",
    fontSize: "1.1rem",
    marginTop: "10px",
    background: "var(--primary-gradient)",
    border: "none",
  } as CSSProperties,

  vnpayLogoContainer: {
    textAlign: "center",
    marginTop: "10px",
  } as CSSProperties,

  vnpayLogo: {
    height: 30,
    opacity: 1,
  } as CSSProperties,

  modalTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  } as CSSProperties,

  modalTitleText: {
    margin: 0,
  } as CSSProperties,

  modalSpinner: {
    textAlign: "center",
    padding: "40px",
  } as CSSProperties,

  formContainer: {
    marginTop: 20,
  } as CSSProperties,

  formActionButtons: {
    marginTop: 24,
    display: "flex",
    gap: "12px",
  } as CSSProperties,

  buttonFlex2: {
    flex: 2,
    height: 45,
  } as CSSProperties,

  buttonFlex1: {
    flex: 1,
    height: 45,
  } as CSSProperties,

  addressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  } as CSSProperties,

  addAddressBtn: {
    color: "var(--primary-color)",
  } as CSSProperties,

  addressItemRadio: (isSelected: boolean): CSSProperties => ({
    width: "100%",
    padding: "16px",
    border: "1px solid var(--glass-border)",
    borderRadius: "12px",
    margin: 0,
    background: isSelected ? "rgba(99, 102, 241, 0.05)" : "transparent",
    transition: "all 0.3s ease",
  }),

  addressMeta: {
    display: "inline-block",
    marginLeft: "8px",
    verticalAlign: "top",
    width: "90%",
  } as CSSProperties,

  addressTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  } as CSSProperties,

  addressFullName: {
    fontSize: "16px",
  } as CSSProperties,

  defaultTag: {
    borderRadius: "4px",
    margin: 0,
  } as CSSProperties,

  addressPhone: {
    marginTop: "4px",
  } as CSSProperties,

  addressDetail: {
    marginTop: "4px",
  } as CSSProperties,

  addressDetailText: {
    color: "var(--text-main)",
  } as CSSProperties,

  dividerMargin: {
    margin: "24px 0",
  } as CSSProperties,

  paymentMethodTitle: {
    display: "block",
    marginBottom: 12,
  } as CSSProperties,

  paymentMethodItem: (isSelected: boolean): CSSProperties => ({
    width: "100%",
    padding: "12px 16px",
    border: "1px solid var(--glass-border)",
    borderRadius: "8px",
    margin: 0,
    background: isSelected ? "rgba(99, 102, 241, 0.05)" : "transparent",
  }),

  vnpayLogoSmall: {
    height: 20,
  } as CSSProperties,

  codIcon: {
    color: "var(--primary-color)",
    fontSize: 18,
  } as CSSProperties,

  confirmButton: {
    width: "100%",
    height: 50,
    fontSize: "1.1rem",
    borderRadius: "12px",
  } as CSSProperties,
};
