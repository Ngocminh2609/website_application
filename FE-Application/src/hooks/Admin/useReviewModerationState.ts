import { useState, useEffect } from "react";
import { Modal } from "antd";
import { reviewApi } from "../../api/reviewApi";
import type { ProductReview } from "../../types/coupon-review";
import { notification } from "../../utils/notification";
import { REVIEW_STRINGS } from "../../constants/Admin/review-moderation";

export const useReviewModerationState = () => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewApi.getAllAdmin();
      setReviews(data);
    } catch {
      notification.error(REVIEW_STRINGS.messages.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await reviewApi.approve(id);
      notification.success(REVIEW_STRINGS.messages.approveSuccess);
      fetchAllReviews();
    } catch {
      notification.error(REVIEW_STRINGS.messages.approveError);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: REVIEW_STRINGS.messages.deleteTitle,
      content: REVIEW_STRINGS.messages.deleteContent,
      okType: "danger",
      onOk: async () => {
        try {
          await reviewApi.delete(id);
          notification.success(REVIEW_STRINGS.messages.deleteSuccess);
          fetchAllReviews();
        } catch {
          notification.error(REVIEW_STRINGS.messages.deleteError);
        }
      },
    });
  };

  return {
    reviews,
    loading,
    handleApprove,
    handleDelete,
  };
};
