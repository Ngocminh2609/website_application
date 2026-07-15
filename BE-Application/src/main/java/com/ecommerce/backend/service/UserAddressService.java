package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.UserAddressDTO;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.UserAddress;
import com.ecommerce.backend.repository.UserAddressRepository;
import com.ecommerce.backend.repository.UserRepository;
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
    private final UserRepository userRepository;

    public List<UserAddressDTO> getUserAddresses(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(ERROR_USER_NOT_FOUND));

        return userAddressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserAddressDTO addAddress(String username, UserAddressDTO addressDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(ERROR_USER_NOT_FOUND));

        // Nếu là địa chỉ đầu tiên hoặc được đánh dấu là mặc định
        if (addressDTO.getIsDefault() || userAddressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user).isEmpty()) {
            resetDefaultAddress(user);
            addressDTO.setIsDefault(true);
        }

        UserAddress address = UserAddress.builder()
                .user(user)
                .fullName(addressDTO.getFullName())
                .phoneNumber(addressDTO.getPhoneNumber())
                .province(addressDTO.getProvince())
                .ward(addressDTO.getWard())
                .detailAddress(addressDTO.getDetailAddress())
                .isDefault(addressDTO.getIsDefault())
                .build();

        return convertToDTO(userAddressRepository.save(address));
    }

    @Transactional
    public UserAddressDTO updateAddress(String username, Long addressId, UserAddressDTO addressDTO) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException(ERROR_ADDRESS_NOT_FOUND));

        if (!address.getUser().getUsername().equals(username)) {
            throw new RuntimeException(ERROR_NO_PERMISSION_EDIT);
        }

        if (addressDTO.getIsDefault() && !address.getIsDefault()) {
            resetDefaultAddress(address.getUser());
        }

        address.setFullName(addressDTO.getFullName());
        address.setPhoneNumber(addressDTO.getPhoneNumber());
        address.setProvince(addressDTO.getProvince());
        address.setWard(addressDTO.getWard());
        address.setDetailAddress(addressDTO.getDetailAddress());
        address.setIsDefault(addressDTO.getIsDefault());

        return convertToDTO(userAddressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(String username, Long addressId) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException(ERROR_ADDRESS_NOT_FOUND));

        if (!address.getUser().getUsername().equals(username)) {
            throw new RuntimeException(ERROR_NO_PERMISSION_DELETE);
        }

        userAddressRepository.delete(address);
    }

    @Transactional
    public void setDefaultAddress(String username, Long addressId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(ERROR_USER_NOT_FOUND));

        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException(ERROR_ADDRESS_NOT_FOUND));

        if (!address.getUser().getUsername().equals(username)) {
            throw new RuntimeException(ERROR_NO_PERMISSION_EDIT);
        }

        resetDefaultAddress(user);
        address.setIsDefault(true);
        userAddressRepository.save(address);
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
