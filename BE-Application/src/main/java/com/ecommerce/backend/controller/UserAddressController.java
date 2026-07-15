package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.UserAddressDTO;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.CurrentUser;
import com.ecommerce.backend.service.UserAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserAddressController {

    private final UserAddressService userAddressService;

    @GetMapping
    public ResponseEntity<List<UserAddressDTO>> getUserAddresses(@CurrentUser User user) {
        return ResponseEntity.ok(userAddressService.getUserAddresses(user));
    }

    @PostMapping
    public ResponseEntity<UserAddressDTO> addAddress(@CurrentUser User user, @RequestBody UserAddressDTO addressDTO) {
        return ResponseEntity.ok(userAddressService.addAddress(user, addressDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserAddressDTO> updateAddress(
            @CurrentUser User user,
            @PathVariable Long id,
            @RequestBody UserAddressDTO addressDTO) {
        return ResponseEntity.ok(userAddressService.updateAddress(user, id, addressDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@CurrentUser User user, @PathVariable Long id) {
        userAddressService.deleteAddress(user, id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<Void> setDefaultAddress(@CurrentUser User user, @PathVariable Long id) {
        userAddressService.setDefaultAddress(user, id);
        return ResponseEntity.ok().build();
    }
}
