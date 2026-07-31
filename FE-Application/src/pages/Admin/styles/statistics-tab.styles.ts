import type {CSSProperties} from "react";
import {
    ADMIN_PAGE_HEADER_STYLES,
    LOADING_CONTAINER_STYLE,
} from "../../../styles/commonStyles";

export const styles = {
    container: {
        ...ADMIN_PAGE_HEADER_STYLES.container,
        marginTop: 20,
    } as CSSProperties,

    header: {
        ...ADMIN_PAGE_HEADER_STYLES.header,
        marginBottom: 30,
    } as CSSProperties,

    headerTitle: ADMIN_PAGE_HEADER_STYLES.headerTitle,

    select: {
        width: 200,
    } as CSSProperties,

    spinnerContainer: LOADING_CONTAINER_STYLE,

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
