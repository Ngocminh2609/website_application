import { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContextDefinition";

/**
 * Hook để sử dụng dữ liệu và các thao tác trong danh sách yêu thích.
 */
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
