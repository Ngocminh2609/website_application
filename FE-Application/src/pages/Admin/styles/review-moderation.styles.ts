import type {CSSProperties} from "react";
import {ADMIN_PAGE_HEADER_STYLES} from "../../../styles/commonStyles";

export const styles = {
    ...ADMIN_PAGE_HEADER_STYLES,
    avatar: {
        border: "1px solid rgba(255,255,255,0.1)",
    } as CSSProperties,

    fullName: {
        display: "block",
        color: "var(--text-main)",
    } as CSSProperties,

    createdAt: {
        fontSize: 11,
        color: "var(--text-muted)",
    } as CSSProperties,

    shopIcon: {
        color: "var(--primary-color)",
    } as CSSProperties,

    productId: {
        fontSize: 13,
    } as CSSProperties,

    rate: {
        fontSize: 12,
        marginBottom: 4,
    } as CSSProperties,

    comment: {
        color: "var(--text-main)",
        fontSize: 13,
        lineHeight: "1.4",
    } as CSSProperties,

    tagSpace: {
        marginTop: 8,
    } as CSSProperties,

    tag: {
        fontSize: 10,
        borderRadius: 4,
    } as CSSProperties,

    header: {
        ...ADMIN_PAGE_HEADER_STYLES.header,
        justifyContent: undefined,
        display: undefined,
    } as CSSProperties,
};
