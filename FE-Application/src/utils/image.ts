import type { SyntheticEvent } from "react";
import { FALLBACK_IMAGE } from "../styles/commonStyles";

/**
 * Xử lý lỗi tải ảnh: chuyển sang ảnh fallback (chỉ một lần).
 */
export const handleImgError = (
  e: SyntheticEvent<HTMLImageElement, Event>,
): void => {
  const target = e.target as HTMLImageElement;
  if (target.dataset.errored === "true") return;
  target.dataset.errored = "true";
  target.src = FALLBACK_IMAGE;
};
