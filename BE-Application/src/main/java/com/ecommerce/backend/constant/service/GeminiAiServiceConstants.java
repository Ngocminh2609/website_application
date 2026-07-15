package com.ecommerce.backend.constant.service;

/**
 * Hằng số cấu hình GeminiAiService.
 */
public final class GeminiAiServiceConstants {

    private GeminiAiServiceConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    public static final String API_BASE_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/";
    public static final String GENERATE_CONTENT_SUFFIX = ":generateContent";

    public static final int CONNECT_TIMEOUT_MS = 10_000;
    public static final int READ_TIMEOUT_MS = 30_000;
    public static final int RETRY_MAX_ATTEMPTS = 2;
    public static final long RETRY_DELAY_MS = 800;

    public static final String DEFAULT_MODEL = "gemini-3.1-flash-lite";
    public static final String FALLBACK_MODEL = "gemini-3.5-flash";

    public static final String SYSTEM_PROMPT = """
            Bạn là NovaBot — trợ lý hỗ trợ khách hàng của Tech Nova (Laptop, Gaming Gear, linh kiện PC).

            Trả lời ĐÚNG định dạng JSON (không markdown):
            {"reply":"<câu trả lời tiếng Việt>","handoff":true|false}

            Quy tắc handoff=true khi:
            - Khách muốn gặp / chat với tư vấn viên, admin, người thật
            - Câu hỏi cần dữ liệu cá nhân: đơn hàng của tôi, trạng thái giao hàng, hoàn tiền, tài khoản
            - Vấn đề phức tạp bạn không giải quyết được chắc chắn

            Quy tắc handoff=false khi:
            - Hỏi chính sách chung, cách đặt hàng, thanh toán, bảo hành, giới thiệu shop

            Quy tắc nội dung reply:
            - Ngắn gọn, lịch sự, tiếng Việt
            - Không bịa giá / chính sách cụ thể nếu không chắc
            - Khi handoff=true: nói rõ đã chuyển yêu cầu tới tư vấn viên, nhờ khách chờ

            Kiến thức shop:
            - Đặt hàng: chọn SP → giỏ → thanh toán; giao toàn quốc 2–4 ngày
            - Bảo hành chính hãng 12–36 tháng; 1 đổi 1 trong 30 ngày nếu lỗi NSX
            - Thanh toán: COD, chuyển khoản, Momo, VNPay
            """;

    public static final String FALLBACK_REPLY =
            "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Đã gửi yêu cầu tới tư vấn viên, bạn chờ một chút nhé!";

    public static final String BUSY_REPLY =
            "Hệ thống AI đang quá tải tạm thời. Đã gửi yêu cầu tới tư vấn viên, bạn chờ một chút nhé!";

    public static final String LOG_CALL_FAILED = "Gọi Gemini API thất bại: {}";
    public static final String LOG_EMPTY_RESPONSE = "Gemini trả về phản hồi rỗng";
    public static final String LOG_API_KEY_MISSING = "Thiếu GEMINI_API_KEY — dùng fallback reply";
    public static final String LOG_USING_MODEL = "NovaBot dùng Gemini model: {}";
    public static final String LOG_RETRY = "Gemini 503 — thử lại lần {} với model {}";
    public static final String LOG_SWITCH_FALLBACK = "Chuyển sang model dự phòng: {}";
    public static final String LOG_PARSE_JSON_FAILED = "Không parse được JSON từ Gemini, dùng raw text. raw={}";
}
