import { TRACKING_KEYS } from "../constants/Utils/utils";

export interface CategoryInterest {
  categoryName: string;
  score: number; // Điểm số dựa trên số lần xem và thời gian
}

export const trackingUtils = {
  /**
   * Ghi lại sản phẩm người dùng vừa xem.
   */
  trackProductView: (productId: number) => {
    try {
      const raw = localStorage.getItem(TRACKING_KEYS.RECENTLY_VIEWED_KEY);
      let viewedIds: number[] = raw ? JSON.parse(raw) : [];

      // Đưa ID lên đầu danh sách, loại bỏ trùng lặp cũ
      viewedIds = [productId, ...viewedIds.filter((id) => id !== productId)];

      // Giới hạn số lượng lưu trữ
      if (viewedIds.length > TRACKING_KEYS.MAX_RECENT_ITEMS) {
        viewedIds = viewedIds.slice(0, TRACKING_KEYS.MAX_RECENT_ITEMS);
      }

      localStorage.setItem(TRACKING_KEYS.RECENTLY_VIEWED_KEY, JSON.stringify(viewedIds));

      // Đồng bộ lên Server nếu đã đăng nhập (Silent call)
      const token = localStorage.getItem("token");
      if (token) {
        import("../api/recommendationApi").then(({ recommendationApi }) => {
          recommendationApi.trackView(productId).catch(() => {});
        });
      }
    } catch (e) {
      console.error("Lỗi khi lưu dấu vết xem sản phẩm:", e);
    }
  },

  /**
   * Ghi lại sự quan tâm đến danh mục sản phẩm.
   */
  trackCategoryView: (categoryName: string) => {
    try {
      if (!categoryName) return;
      const raw = localStorage.getItem(TRACKING_KEYS.CATEGORY_INTEREST_KEY);
      const interests: CategoryInterest[] = raw ? JSON.parse(raw) : [];

      const index = interests.findIndex((i) => i.categoryName === categoryName);
      if (index > -1) {
        interests[index].score += 1;
      } else {
        interests.push({ categoryName, score: 1 });
      }

      // Sắp xếp theo độ quan tâm giảm dần
      interests.sort((a, b) => b.score - a.score);

      localStorage.setItem(
        TRACKING_KEYS.CATEGORY_INTEREST_KEY,
        JSON.stringify(interests.slice(0, 5)),
      );
    } catch (e) {
      console.error("Lỗi khi lưu dấu vết xem danh mục:", e);
    }
  },

  /**
   * Lấy danh sách ID sản phẩm đã xem gần đây.
   */
  getRecentlyViewedIds: (): number[] => {
    try {
      const raw = localStorage.getItem(TRACKING_KEYS.RECENTLY_VIEWED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Lấy danh mục được quan tâm nhất.
   */
  getTopInterests: (): string[] => {
    try {
      const raw = localStorage.getItem(TRACKING_KEYS.CATEGORY_INTEREST_KEY);
      const interests: CategoryInterest[] = raw ? JSON.parse(raw) : [];
      return interests.map((i) => i.categoryName);
    } catch {
      return [];
    }
  },
};
