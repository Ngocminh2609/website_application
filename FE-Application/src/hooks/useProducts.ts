import { createContext, useContext } from 'react';
import type { Product } from '../types/product';

import type { Category } from '../types/category';

export interface ProductContextType {
    products: Product[];
    flashSales: Product[];
    bestSellers: Product[];
    categories: Category[];
    loading: boolean;
    fetchProducts: (force?: boolean) => Promise<void>;
    fetchProductsByBrand: (brand: string) => Promise<Product[]>;
    initializeHomeData: (force?: boolean) => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

/**
 * Hook để sử dụng dữ liệu sản phẩm trong các component.
 */
export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts phải được sử dụng trong ProductProvider');
    }
    return context;
};
