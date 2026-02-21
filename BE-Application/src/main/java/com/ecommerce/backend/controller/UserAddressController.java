package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.UserAddressDTO;
import com.ecommerce.backend.service.UserAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserAddressController {

    private final UserAddressService userAddressService;

    @GetMapping
    public ResponseEntity<List<UserAddressDTO>> getUserAddresses(Authentication authentication) {
        return ResponseEntity.ok(userAddressService.getUserAddresses(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<UserAddressDTO> addAddress(Authentication authentication, @RequestBody UserAddressDTO addressDTO) {
        return ResponseEntity.ok(userAddressService.addAddress(authentication.getName(), addressDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserAddressDTO> updateAddress(
            Authentication authentication, 
            @PathVariable Long id, 
            @RequestBody UserAddressDTO addressDTO) {
        return ResponseEntity.ok(userAddressService.updateAddress(authentication.getName(), id, addressDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(Authentication authentication, @PathVariable Long id) {
        userAddressService.deleteAddress(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<Void> setDefaultAddress(Authentication authentication, @PathVariable Long id) {
        userAddressService.setDefaultAddress(authentication.getName(), id);
        return ResponseEntity.ok().build();
    }
}
