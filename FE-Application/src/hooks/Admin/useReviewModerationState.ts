import { reviewApi } from "../../api/reviewApi";
import type { ProductReview } from "../../types/review";
import { notification } from "../../utils/notification";
import { REVIEW_STRINGS } from "../../constants/Admin/review-moderation";
import { confirmDelete } from "../common/useConfirmDelete";
import { getErrorMessage } from "../../utils/error";
import { useAsyncList } from "../common/useFetchOnMount";

export const useReviewModerationState = () => {
  const {
    data: reviews,
    loading,
    refetch: fetchAllReviews,
  } = useAsyncList(
    () => reviewApi.getAllAdmin(),
    REVIEW_STRINGS.messages.loadError,
    [] as ProductReview[],
  );

  const handleApprove = async (id: number) => {
    try {
      await reviewApi.approve(id);
      notification.success(REVIEW_STRINGS.messages.approveSuccess);
      await fetchAllReviews();
  } catch (error: unknown) {
      notification.error(
        getErrorMessage(error, REVIEW_STRINGS.messages.approveError),
      );
    }
  };

  const handleDelete = (id: number) => {
    confirmDelete({
      title: REVIEW_STRINGS.messages.deleteTitle,
      content: REVIEW_STRINGS.messages.deleteContent,
      onDelete: async () => {
        await reviewApi.delete(id);
      },
      successMessage: REVIEW_STRINGS.messages.deleteSuccess,
      errorMessage: REVIEW_STRINGS.messages.deleteError,
      onSuccess: async () => {
        await fetchAllReviews();
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
