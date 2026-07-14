import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useWishlist } from "./useWishlist";

export const useWishlistPage = () => {
  const { wishlistItems, removeFromWishlist, refreshWishlist } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist, location.key]);

  return {
    wishlistItems,
    removeFromWishlist,
  };
};
