import React from "react";
import {Card, Empty} from "antd";
import type {CSSProperties, ReactNode} from "react";

interface Props {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    wrapper?: "card" | "plain";
    style?: CSSProperties;
    iconStyle?: CSSProperties;
    titleStyle?: CSSProperties;
}

const EmptyStateCard: React.FC<Props> = ({
    icon,
    title,
    description,
    action,
    wrapper = "plain",
    style,
    iconStyle,
    titleStyle,
}) => {
    const content = (
        <Empty
            image={icon && <span style={iconStyle}>{icon}</span>}
            description={
                <>
                    <span style={titleStyle}>{title}</span>
                    {description}
                </>
            }
        >
            {action}
        </Empty>
    );

    return wrapper === "card" ? (
        <Card className="glass-effect" style={style}>{content}</Card>
    ) : (
        <div style={style}>{content}</div>
    );
};

export default EmptyStateCard;
