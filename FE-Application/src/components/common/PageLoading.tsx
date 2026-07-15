import type { FC, ReactNode } from "react";
import { Spin } from "antd";
import type { CSSProperties } from "react";

const DEFAULT_CONTAINER_STYLE: CSSProperties = {
  textAlign: "center",
  padding: "100px",
};

interface PageLoadingProps {
  tip?: ReactNode;
  style?: CSSProperties;
  size?: "small" | "default" | "large";
}

/**
 * Spinner full-page dùng chung cho các trang đang tải dữ liệu.
 */
export const PageLoading: FC<PageLoadingProps> = ({
  tip,
  style,
  size = "large",
}) => (
  <div style={{ ...DEFAULT_CONTAINER_STYLE, ...style }}>
    <Spin size={size} tip={tip} />
  </div>
);
