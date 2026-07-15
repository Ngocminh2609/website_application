package com.ecommerce.backend.util.storage;

import java.util.function.BiConsumer;

/**
 * Tiện ích xóa ảnh cũ khi thay thế bằng URL mới.
 */
public final class ImageReplaceUtil {

    private ImageReplaceUtil() {
    }

    /**
     * Nếu oldUrl khác newUrl (và cả hai không null) thì gọi deleteFn(oldUrl, bucket).
     */
    public static void deleteIfReplaced(String oldUrl, String newUrl, String bucket,
                                       BiConsumer<String, String> deleteFn) {
        if (oldUrl != null && newUrl != null && !oldUrl.equals(newUrl)) {
            deleteFn.accept(oldUrl, bucket);
        }
    }
}
