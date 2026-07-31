import {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {cartApi} from "../../api/cartApi";
import {requireAuth} from "../../utils/auth";
import {notification} from "../../utils/notification";
import {COMMON_STRINGS} from "../../constants/Common/common";
import {useCart} from "./useCart";

export interface AddToCartOptions {
    /** Ảnh để chạy hiệu ứng bay vào giỏ */
    imgElement?: HTMLImageElement | null;
    /** Hiện toast thành công — mặc định true */
    notify?: boolean;
    /** Kiểm tra đăng nhập trước — mặc định true */
    checkAuth?: boolean;
    /** Điều hướng sau khi thêm thành công (vd: "/cart") */
    navigateTo?: string;
    /** Message lỗi tùy chỉnh */
    errorMessage?: string;
}

/**
 * Gom flow thêm giỏ: auth → fly animation → API → refreshCart → toast/navigate.
 */
export const useAddToCart = () => {
    const {refreshCart} = useCart();
    const navigate = useNavigate();

    const addToCart = useCallback(
        async (
            productId: number,
            options: AddToCartOptions = {},
        ): Promise<boolean> => {
            const {
                imgElement,
                notify = true,
                checkAuth = true,
                navigateTo,
                errorMessage = COMMON_STRINGS.productCard.addCartError,
            } = options;

            if (checkAuth && !requireAuth()) return false;

            try {
                if (imgElement) {
                    const {flyToCart} = await import("../../utils/cartAnimation");
                    flyToCart(imgElement);
                }

                await cartApi.addToCart(productId, 1);
                await refreshCart(true);

                if (notify) {
                    notification.product.addCartSuccess();
                }
                if (navigateTo) {
                    navigate(navigateTo);
                }
                return true;
            } catch {
                notification.error(errorMessage);
                return false;
            }
        },
        [refreshCart, navigate],
    );

    return {addToCart};
};
