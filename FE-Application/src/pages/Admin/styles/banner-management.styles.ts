import type {CSSProperties} from "react";
import {ADMIN_PAGE_HEADER_STYLES} from "../../../styles/commonStyles";

export const styles = {
    ...ADMIN_PAGE_HEADER_STYLES,
    bannerImage: {
        width: "150px",
        height: "50px",
        objectFit: "cover",
        borderRadius: "8px",
        border: "1px solid var(--glass-border)",
    } as CSSProperties,

    titleText: {
        color: "var(--text-main)",
    } as CSSProperties,

    linkText: {
        color: "var(--text-muted)",
    } as CSSProperties,

    inputNumberWidth: {
        width: "100%",
    } as CSSProperties,

    uploadButtonText: {
        marginTop: 8,
    } as CSSProperties,

    imageUrlInput: {
        height: 102,
    } as CSSProperties,
};
