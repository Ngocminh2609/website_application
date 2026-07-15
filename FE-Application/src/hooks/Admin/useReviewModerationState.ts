import { useState, useEffect } from "react";
import { reviewApi } from "../../api/reviewApi";
import type { ProductReview } from "../../types/review";
import { notification } from "../../utils/notification";
import { REVIEW_STRINGS } from "../../constants/Admin/review-moderation";
import { confirmDelete } from "../common/useConfirmDelete";

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
    confirmDelete({
      title: REVIEW_STRINGS.messages.deleteTitle,
      content: REVIEW_STRINGS.messages.deleteContent,
      onDelete: () => reviewApi.delete(id),
      successMessage: REVIEW_STRINGS.messages.deleteSuccess,
      errorMessage: REVIEW_STRINGS.messages.deleteError,
      onSuccess: fetchAllReviews,
    });
  };

  return {
    reviews,
    loading,
    handleApprove,
    handleDelete,
  };
};
