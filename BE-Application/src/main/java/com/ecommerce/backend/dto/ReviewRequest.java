package com.ecommerce.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import static com.ecommerce.backend.constant.dto.ReviewRequestConstants.*;

/**
 * Request body khi người dùng gửi đánh giá sản phẩm.
 */
@Getter
@Setter
public class ReviewRequest {

    @NotNull(message = ERROR_RATING_REQUIRED)
    @Min(value = RATING_MIN, message = ERROR_RATING_MIN)
    @Max(value = RATING_MAX, message = ERROR_RATING_MAX)
    private Integer rating;

    private String comment;
}
