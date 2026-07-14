import { useEffect, useState } from "react";
import { useProducts } from "../Product/useProducts";
import type { Product } from "../../types/product";
import type { Banner } from "../../types/banner";
import { bannerApi } from "../../api/bannerApi";
import { formatBrandsData, resolveBanners } from "../../pages/Home/helper";

export const useHomePage = () => {
    const {
        flashSales,
        bestSellers,
        categories,
        loading: productLoading,
        initializeHomeData,
        fetchProductsByBrand,
    } = useProducts();
    const [brandsData, setBrandsData] = useState<
        { id: string; name: string; products: Product[] }[]
    >([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loadingBrands, setLoadingBrands] = useState<boolean>(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoadingBrands(true);
                // Khởi tạo các danh sách chính (Flash Sale, Best Seller, Categories) từ Context để tránh gọi trùng
                await initializeHomeData();

                // Sử dụng hàm từ context để đảm bảo cơ chế Single Flight (không gọi trùng lặp Apple/Samsung)
                const [apple, samsung, activeBanners] = await Promise.all([
                    fetchProductsByBrand("Apple"),
                    fetchProductsByBrand("Samsung"),
                    bannerApi.getActiveBanners().catch((err) => {
                        console.error("Lỗi khi tải banners:", err);
                        return [];
                    }),
                ]);

                setBrandsData(formatBrandsData(apple, samsung));
                setBanners(resolveBanners(activeBanners));
            } catch (error) {
                console.error("Lỗi khi tải trang chủ:", error);
            } finally {
                setLoadingBrands(false);
            }
        };

        fetchHomeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Chỉ chạy 1 lần khi mount - initializeHomeData & fetchProductsByBrand là useCallback ổn định

    return {
        flashSales,
        bestSellers,
        categories,
        productLoading,
        brandsData,
        banners,
        loadingBrands,
    };
};
