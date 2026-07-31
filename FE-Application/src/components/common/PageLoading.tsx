import type {FC, ReactNode} from "react";
import {Spin} from "antd";
import type {SpinProps} from "antd";
import type {CSSProperties} from "react";
import {LOADING_CONTAINER_STYLE} from "../../styles/commonStyles";

interface PageLoadingProps {
    tip?: ReactNode;
    style?: CSSProperties;
    size?: "small" | "default" | "large";
    indicator?: ReactNode;
}

/**
 * Spinner full-page dùng chung cho các trang đang tải dữ liệu.
 */
export const PageLoading: FC<PageLoadingProps> = ({
                                                      tip,
                                                      style,
                                                      size = "large",
                                                      indicator,
                                                  }) => (
    <div style={{...LOADING_CONTAINER_STYLE, ...style}}>
        <Spin size={size} description={tip} indicator={indicator as SpinProps["indicator"]}/>
    </div>
);
