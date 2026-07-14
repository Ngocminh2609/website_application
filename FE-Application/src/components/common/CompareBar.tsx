import React, { useState } from "react";
import { useCompare } from "../../hooks/Product/useCompare";
import { Button, Badge, Tooltip } from "antd";
import {
  SwapOutlined,
  CloseOutlined,
  DeleteOutlined,
  ArrowsAltOutlined,
  ShrinkOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { FALLBACK_IMAGE } from "../../styles/commonStyles";
import { styles } from "./styles/CompareBar.styles";
import { COMMON_STRINGS } from "../../constants/Common/common";

/**
 * CompareBar - UX độc đáo: Thanh so sánh nổi phía dưới màn hình với hiệu ứng mượt mà.
 */
const CompareBar: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.dataset.errored === "true") return;
    target.dataset.errored = "true";
    target.src = FALLBACK_IMAGE;
  };

  if (compareItems.length === 0) return null;

  return (
    <div
      className={`compare-bar ${isExpanded ? "expanded" : "collapsed"}`}
      style={styles.container(isExpanded)}
    >
      <div style={styles.content(isExpanded)}>
        {/* Nút Thu gọn/Mở rộng */}
        <Button
          type="text"
          icon={isExpanded ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
          onClick={() => setIsExpanded(!isExpanded)}
          style={styles.toggleButton}
        />

        {isExpanded && (
          <>
            <div style={styles.itemsContainer}>
              {compareItems.map((item) => (
                <div key={item.id} style={styles.itemWrapper}>
                  <Badge
                    count={<CloseOutlined style={styles.closeIcon} />}
                    onClick={() => removeFromCompare(item.id)}
                    offset={[-5, 5]}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      onError={handleImgError}
                      style={styles.itemImage}
                    />
                  </Badge>
                </div>
              ))}
              {/* Chốt giữ chỗ nếu chưa đủ 4 */}
              {Array.from({ length: 4 - compareItems.length }).map((_, i) => (
                <div key={i} style={styles.emptyPlaceholder}>
                  <SwapOutlined />
                </div>
              ))}
            </div>

            <div className="compare-actions" style={styles.actionsContainer}>
              <Button
                type="primary"
                icon={<SwapOutlined />}
                disabled={compareItems.length < 2}
                onClick={() => navigate("/compare")}
                style={styles.compareBtn}
              >
                {COMMON_STRINGS.compareBar.compareNow} ({compareItems.length})
              </Button>
              <Tooltip title={COMMON_STRINGS.compareBar.clearAll}>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={clearCompare}
                  style={styles.clearBtn}
                />
              </Tooltip>
            </div>
          </>
        )}

        {!isExpanded && (
          <Badge count={compareItems.length} offset={[5, -5]}>
            <SwapOutlined
              style={styles.collapsedIcon}
              onClick={() => setIsExpanded(true)}
            />
          </Badge>
        )}
      </div>
    </div>
  );
};

export default CompareBar;
