import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { cartApi } from "../../api/cartApi";
import { reviewApi } from "../../api/reviewApi";
import { useCart } from "../Cart/useCart";
import type { Product } from "../../types/product";
import type { ProductReview } from "../../types/coupon-review";
import { notification } from "../../utils/notification";

export const useProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { refreshCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mainImage, setMainImage] = useState<string>("");
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const currentUser = (() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();

  const fetchReviews = async (productId: number) => {
    try {
      setReviewLoading(true);
      const data = await reviewApi.getByProduct(productId);
      setReviews(data);
    } catch {
      // Không cần hiện lỗi khi review rỗng
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productApi.getProductById(parseInt(id));
        setProduct(data);
        setMainImage(data.imageUrl);

        // Theo dõi hành vi người dùng
        import("../../utils/tracking").then(({ trackingUtils }) => {
          trackingUtils.trackProductView(data.id);
          if (data.category?.name) {
            trackingUtils.trackCategoryView(data.category.name);
          }
        });

        await fetchReviews(parseInt(id));
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error("Vui lòng đăng nhập để thực hiện");
      return;
    }

    try {
      if (imageContainerRef.current) {
        const imgElement = imageContainerRef.current.querySelector("img");
        if (imgElement) {
          const { flyToCart } = await import("../../utils/cartAnimation");
          flyToCart(imgElement);
        }
      }

      await cartApi.addToCart(product.id, 1);
      await refreshCart(true);
      notification.product.addCartSuccess();
    } catch {
      notification.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const handleSubmitReview = async () => {
    if (!currentUser) {
      notification.error("Vui lòng đăng nhập để gửi đánh giá");
      return;
    }
    if (!id) return;
    try {
      setSubmitLoading(true);
      await reviewApi.create(parseInt(id), {
        rating: userRating,
        comment: userComment,
      });
      notification.success("Gửi đánh giá thành công!");
      setUserComment("");
      setUserRating(5);
      await fetchReviews(parseInt(id));
    } catch (err: unknown) {
      notification.error(
        err instanceof Error ? err.message : "Gửi đánh giá thất bại",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await reviewApi.delete(reviewId);
      notification.success("Xóa đánh giá thành công");
      if (id) await fetchReviews(parseInt(id));
    } catch (err: unknown) {
      notification.error(err instanceof Error ? err.message : "Xóa thất bại");
    }
  };

  // Tính phân bố số sao để hiển thị progress bar
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
    percent:
      reviews.length > 0
        ? Math.round(
            (reviews.filter((r) => Math.round(r.rating) === star).length /
              reviews.length) *
              100,
          )
        : 0,
  }));

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : (product?.rating || 5).toFixed(1);

  return {
    id,
    product,
    loading,
    mainImage,
    setMainImage,
    reviews,
    reviewLoading,
    submitLoading,
    userRating,
    setUserRating,
    userComment,
    setUserComment,
    currentUser,
    imageContainerRef,
    handleAddToCart,
    handleSubmitReview,
    handleDeleteReview,
    ratingDistribution,
    avgRating,
  };
};
