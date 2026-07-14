import type { CSSProperties } from "react";
import { LOGIN_CARD_STYLE } from "../../../styles/commonStyles";

export const styles = {
  loginCard: LOGIN_CARD_STYLE as CSSProperties,
  headerContainer: {
    textAlign: "center",
    marginBottom: "30px",
  } as CSSProperties,
  title: {
    color: "var(--text-main)",
    margin: 0,
    fontWeight: 700,
  } as CSSProperties,
  subText: {
    color: "var(--text-muted)",
  } as CSSProperties,
  inputPrefix: {
    color: "var(--primary-color)",
  } as CSSProperties,
  loginButton: {
    width: "100%",
    height: "52px",
    borderRadius: "12px",
    fontWeight: 600,
  } as CSSProperties,
  divider: {
    borderColor: "var(--glass-border)",
  } as CSSProperties,
  dividerText: {
    color: "var(--text-muted)",
    fontSize: "12px",
  } as CSSProperties,
  googleLoginContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  } as CSSProperties,
  footerContainer: {
    textAlign: "center",
  } as CSSProperties,
  footerText: {
    color: "var(--text-muted)",
  } as CSSProperties,
  registerLink: {
    color: "var(--primary-color)",
    cursor: "pointer",
    fontWeight: 600,
  } as CSSProperties,
};
