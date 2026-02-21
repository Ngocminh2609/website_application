package com.ecommerce.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddressDTO {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String province;
    private String ward;
    private String detailAddress;
    private Boolean isDefault;
}
