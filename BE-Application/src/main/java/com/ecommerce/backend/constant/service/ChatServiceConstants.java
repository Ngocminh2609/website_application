package com.ecommerce.backend.constant.service;

/**
 * Hằng số ChatService — chỉnh sửa tin nhắn.
 */
public final class ChatServiceConstants {

    private ChatServiceConstants() {
    }

    /** Thời hạn được phép sửa / thu hồi tin nhắn (giờ). */
    public static final long EDIT_WINDOW_HOURS = 24;

    public static final String RECALLED_CONTENT = "Tin nhắn đã được thu hồi";

    public static final String ERROR_NOT_FOUND = "Không tìm thấy tin nhắn";
    public static final String ERROR_FORBIDDEN = "Bạn không có quyền thao tác tin nhắn này";
    public static final String ERROR_EXPIRED = "Đã quá 24 giờ — không thể thao tác tin nhắn";
    public static final String ERROR_EMPTY = "Nội dung tin nhắn không được để trống";
    public static final String ERROR_NOT_CHAT = "Chỉ được thao tác tin nhắn chat";
    public static final String ERROR_ALREADY_RECALLED = "Tin nhắn đã được thu hồi";
}
