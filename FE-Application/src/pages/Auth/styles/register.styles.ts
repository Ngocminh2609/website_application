import type { CSSProperties } from "react";
import { REGISTER_CARD_STYLE } from "../../../styles/commonStyles";

export const styles = {
  registerCard: REGISTER_CARD_STYLE as CSSProperties,
  headerContainer: {
    textAlign: "center",
    marginBottom: "30px",
  } as CSSProperties,
  title: {
    color: "var(--text-main)",
    margin: 0,
  } as CSSProperties,
  subText: {
    color: "var(--text-muted)",
  } as CSSProperties,
  inputPrefix: {
    color: "var(--primary-color)",
  } as CSSProperties,
  registerButton: {
    width: "100%",
    height: "50px",
  } as CSSProperties,
  footerContainer: {
    textAlign: "center",
  } as CSSProperties,
  footerText: {
    color: "var(--text-muted)",
  } as CSSProperties,
  loginLink: {
    color: "var(--primary-color)",
    cursor: "pointer",
  } as CSSProperties,
};
