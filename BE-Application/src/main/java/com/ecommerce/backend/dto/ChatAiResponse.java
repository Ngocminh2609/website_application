package com.ecommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatAiResponse {
    private String reply;
    /** true khi AI lỗi — FE escalate sang admin */
    private boolean escalate;
    /** true khi bot chủ động chuyển tư vấn viên */
    private boolean handoff;
    /** Chi tiết lỗi kỹ thuật (khi escalate) */
    private String error;
}
