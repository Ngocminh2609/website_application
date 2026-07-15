package com.ecommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.ecommerce.backend.constant.controller.PaymentConstants.STATUS_FAILED;
import static com.ecommerce.backend.constant.controller.PaymentConstants.STATUS_OK;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentResponse {
    private String status;
    private String message;
    private String url;

    public static PaymentResponse ok(String message, String url) {
        return PaymentResponse.builder().status(STATUS_OK).message(message).url(url).build();
    }

    public static PaymentResponse ok(String message) {
        return PaymentResponse.builder().status(STATUS_OK).message(message).build();
    }

    public static PaymentResponse failed(String message) {
        return PaymentResponse.builder().status(STATUS_FAILED).message(message).build();
    }
}
