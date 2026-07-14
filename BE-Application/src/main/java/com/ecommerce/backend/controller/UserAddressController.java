package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.UserAddressDTO;
import com.ecommerce.backend.security.JwtUserResolver;
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
    private final JwtUserResolver jwtUserResolver;

    @GetMapping
    public ResponseEntity<List<UserAddressDTO>> getUserAddresses(Authentication authentication) {
        String username = jwtUserResolver.getCurrentUser().getUsername();
        return ResponseEntity.ok(userAddressService.getUserAddresses(username));
    }

    @PostMapping
    public ResponseEntity<UserAddressDTO> addAddress(Authentication authentication, @RequestBody UserAddressDTO addressDTO) {
        String username = jwtUserResolver.getCurrentUser().getUsername();
        return ResponseEntity.ok(userAddressService.addAddress(username, addressDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserAddressDTO> updateAddress(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody UserAddressDTO addressDTO) {
        String username = jwtUserResolver.getCurrentUser().getUsername();
        return ResponseEntity.ok(userAddressService.updateAddress(username, id, addressDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(Authentication authentication, @PathVariable Long id) {
        String username = jwtUserResolver.getCurrentUser().getUsername();
        userAddressService.deleteAddress(username, id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<Void> setDefaultAddress(Authentication authentication, @PathVariable Long id) {
        String username = jwtUserResolver.getCurrentUser().getUsername();
        userAddressService.setDefaultAddress(username, id);
        return ResponseEntity.ok().build();
    }
}
