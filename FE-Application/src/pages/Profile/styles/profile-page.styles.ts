import type { CSSProperties } from "react";
import { PROFILE_CARD_STYLE } from "../../../styles/commonStyles";

export const styles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
  } as CSSProperties,
  pageContainer: {
    paddingTop: "100px",
    paddingBottom: "80px",
    color: "var(--text-main)",
  } as CSSProperties,
  headerWrapper: {
    marginBottom: "48px",
  } as CSSProperties,
  headerSub: {
    color: "var(--primary-color)",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontSize: "0.85rem",
  } as CSSProperties,
  headerTitle: {
    color: "var(--text-main)",
    margin: "8px 0 0",
    fontWeight: 800,
  } as CSSProperties,
  leftCard: {
    ...PROFILE_CARD_STYLE,
    textAlign: "center",
  } as CSSProperties,
  avatarWrapper: {
    position: "relative",
    display: "inline-block",
    marginBottom: "24px",
  } as CSSProperties,
  avatar: {
    background: "var(--primary-color)",
    fontSize: "48px",
  } as CSSProperties,
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "36px",
    height: "36px",
    background: "var(--primary-color)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "2px solid #0f172a",
  } as CSSProperties,
  cameraIcon: {
    color: "#fff",
    fontSize: "16px",
  } as CSSProperties,
  userNameText: {
    color: "var(--text-main)",
    margin: "0 0 4px",
  } as CSSProperties,
  userEmailText: {
    color: "var(--text-muted)",
  } as CSSProperties,
  divider: {
    borderColor: "var(--glass-border)",
    margin: "24px 0",
  } as CSSProperties,
  infoContainer: {
    textAlign: "left",
  } as CSSProperties,
  infoItem: {
    marginBottom: "16px",
  } as CSSProperties,
  infoItemLabel: {
    color: "var(--text-muted)",
    fontSize: "0.8rem",
    display: "block",
  } as CSSProperties,
  infoItemValue: {
    color: "var(--text-main)",
    fontWeight: 500,
  } as CSSProperties,
  uploadBtn: {
    width: "100%",
    marginTop: "8px",
    background: "var(--glass-bg)",
    borderColor: "var(--glass-border)",
    color: "var(--text-main)",
    height: "42px",
    borderRadius: "10px",
  } as CSSProperties,
  tabLabelText: {
    color: "inherit",
  } as CSSProperties,
  tabLabelIcon: {
    marginRight: "8px",
  } as CSSProperties,
  profileForm: {
    marginTop: "24px",
  } as CSSProperties,
  formItemLabel: {
    color: "var(--text-main)",
  } as CSSProperties,
  disabledInput: {
    opacity: 0.5,
    cursor: "not-allowed",
  } as CSSProperties,
  submitBtnWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "8px",
  } as CSSProperties,
  profileSubmitBtn: {
    height: "46px",
    padding: "0 40px",
    borderRadius: "12px",
    fontWeight: 600,
  } as CSSProperties,
  passwordForm: {
    marginTop: "24px",
    maxWidth: "480px",
  } as CSSProperties,
  passwordSubmitBtn: {
    height: "46px",
    padding: "0 40px",
    borderRadius: "12px",
    fontWeight: 600,
  } as CSSProperties,
};
