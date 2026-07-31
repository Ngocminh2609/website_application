import type {CSSProperties} from "react";
import {LOADING_CONTAINER_STYLE} from "../../../styles/commonStyles";

export const styles = {
    loadingContainer: LOADING_CONTAINER_STYLE,
    layout: {
        background: "transparent",
        minHeight: "100vh",
        paddingTop: "100px",
    } as CSSProperties,
    productListHeader: {
        marginBottom: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    } as CSSProperties,
    productListTitle: {
        color: "var(--text-main)",
        margin: 0,
    } as CSSProperties,
    productListSubtitle: {
        color: "var(--text-muted)",
    } as CSSProperties,
    emptyResultBox: {
        padding: "100px",
        textAlign: "center",
        background: "var(--glass-bg)",
        borderRadius: "20px",
    } as CSSProperties,
    emptyResultText: {
        color: "var(--text-main)",
    } as CSSProperties,
};
