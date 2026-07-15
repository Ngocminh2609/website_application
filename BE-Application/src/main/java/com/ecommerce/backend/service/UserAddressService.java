package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.UserAddressDTO;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.UserAddress;
import com.ecommerce.backend.repository.UserAddressRepository;
import com.ecommerce.backend.util.persistence.EntityLookupUtil;
import com.ecommerce.backend.util.security.OwnershipUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.ecommerce.backend.constant.service.UserAddressServiceConstants.*;

@Service
@RequiredArgsConstructor
public class UserAddressService {

    private final UserAddressRepository userAddressRepository;

    public List<UserAddressDTO> getUserAddresses(User user) {
        return userAddressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserAddressDTO addAddress(User user, UserAddressDTO addressDTO) {
        if (Boolean.TRUE.equals(addressDTO.getIsDefault())
                || userAddressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user).isEmpty()) {
            resetDefaultAddress(user);
            addressDTO.setIsDefault(true);
        }

        UserAddress address = UserAddress.builder().user(user).build();
        applyDto(address, addressDTO);
        return convertToDTO(userAddressRepository.save(address));
    }

    @Transactional
    public UserAddressDTO updateAddress(User user, Long addressId, UserAddressDTO addressDTO) {
        UserAddress address = requireOwnedAddress(user, addressId, ERROR_NO_PERMISSION_EDIT);

        if (Boolean.TRUE.equals(addressDTO.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            resetDefaultAddress(address.getUser());
        }

        applyDto(address, addressDTO);
        return convertToDTO(userAddressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(User user, Long addressId) {
        UserAddress address = requireOwnedAddress(user, addressId, ERROR_NO_PERMISSION_DELETE);
        userAddressRepository.delete(address);
    }

    @Transactional
    public void setDefaultAddress(User user, Long addressId) {
        UserAddress address = requireOwnedAddress(user, addressId, ERROR_NO_PERMISSION_EDIT);
        resetDefaultAddress(user);
        address.setIsDefault(true);
        userAddressRepository.save(address);
    }

    private UserAddress requireOwnedAddress(User user, Long addressId, String permissionError) {
        UserAddress address = EntityLookupUtil.require(
                userAddressRepository.findById(addressId),
                ERROR_ADDRESS_NOT_FOUND
        );
        OwnershipUtil.requireUsernameMatch(address.getUser().getUsername(), user.getUsername(), permissionError);
        return address;
    }

    private void applyDto(UserAddress address, UserAddressDTO dto) {
        address.setFullName(dto.getFullName());
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setProvince(dto.getProvince());
        address.setWard(dto.getWard());
        address.setDetailAddress(dto.getDetailAddress());
        address.setIsDefault(dto.getIsDefault());
    }

    private void resetDefaultAddress(User user) {
        userAddressRepository.findByUserAndIsDefault(user, true)
                .ifPresent(addr -> {
                    addr.setIsDefault(false);
                    userAddressRepository.save(addr);
                });
    }

    private UserAddressDTO convertToDTO(UserAddress address) {
        return UserAddressDTO.builder()
                .id(address.getId())
                .fullName(address.getFullName())
                .phoneNumber(address.getPhoneNumber())
                .province(address.getProvince())
                .ward(address.getWard())
                .detailAddress(address.getDetailAddress())
                .isDefault(address.getIsDefault())
                .build();
    }
}
