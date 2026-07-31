import type {CSSProperties} from "react";
import {ADMIN_PAGE_HEADER_STYLES} from "../../../styles/commonStyles";

export const styles = {
    ...ADMIN_PAGE_HEADER_STYLES,
    tagCode: {
        fontWeight: 700,
        padding: "4px 10px",
        fontSize: 13,
    } as CSSProperties,

    usageWrapper: {
        width: 100,
    } as CSSProperties,

    usageProgressLabel: {
        fontSize: 11,
        marginBottom: 4,
        display: "flex",
        justifyContent: "space-between",
        color: "var(--text-muted)",
    } as CSSProperties,

    progressBarBg: {
        height: 4,
        background: "var(--glass-border)",
        borderRadius: 2,
    } as CSSProperties,

    progressBarFill: (percent: number): CSSProperties => ({
        height: "100%",
        width: `${percent}%`,
        background: "var(--primary-color)",
        borderRadius: 2,
    }),

    inputCode: {
        textTransform: "uppercase",
    } as CSSProperties,

    inputNumberWidth: {
        width: "100%",
    } as CSSProperties,
};
