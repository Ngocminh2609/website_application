import React from "react";
import type {CSSProperties, ReactNode} from "react";

interface Props {
    title: ReactNode;
    subtitle?: ReactNode;
    action?: ReactNode;
    styles: {
        container?: CSSProperties;
        header: CSSProperties;
        headerTitle: CSSProperties;
        headerSubtitle: CSSProperties;
    };
}

const AdminSectionHeader: React.FC<Props> = ({title, subtitle, action, styles}) => (
    <div style={styles.header}>
        <div>
            <h3 style={styles.headerTitle}>{title}</h3>
            {subtitle != null && <p style={styles.headerSubtitle}>{subtitle}</p>}
        </div>
        {action}
    </div>
);

export default AdminSectionHeader;
