package com.ecommerce.backend.util.storage;

import com.ecommerce.backend.util.text.StringUtil;

import java.util.UUID;

/**
 * Tiện ích đường dẫn / tên file trên object storage.
 */
public final class StoragePathUtil {

    private static final String FILENAME_SEPARATOR = "_";
    private static final String PATH_SEPARATOR = "/";

    private StoragePathUtil() {
    }

    public static String uniqueFileName(String originalFilename) {
        return UUID.randomUUID() + FILENAME_SEPARATOR + originalFilename;
    }

    /**
     * Lấy object key (tên file) từ URL proxy dạng .../bucket/fileName.
     */
    public static String extractObjectKey(String fileUrl) {
        if (StringUtil.isBlank(fileUrl)) {
            return "";
        }
        int idx = fileUrl.lastIndexOf(PATH_SEPARATOR);
        return idx >= 0 ? fileUrl.substring(idx + 1) : fileUrl;
    }
}
