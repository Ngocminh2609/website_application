package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller cho các tác vụ Giỏ hàng.
 * Tất cả các Endpoint đều yêu cầu xác thực người dùng.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * Lấy thông tin giỏ hàng của người dùng đang đăng nhập.
     * @AuthenticationPrincipal để lấy entity User từ SecurityContext.
     */
    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCartByUser(user));
    }

    /**
     * Thêm sản phẩm vào giỏ hàng.
     */
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> payload
    ) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());
        return ResponseEntity.ok(cartService.addItemToCart(user, productId, quantity));
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ.
     */
    @PutMapping("/update/{itemId}")
    public ResponseEntity<Cart> updateQuantity(
            @AuthenticationPrincipal User user,
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> payload
    ) {
        Integer quantity = payload.get("quantity");
        return ResponseEntity.ok(cartService.updateItemQuantity(user, itemId, quantity));
    }

    /**
     * Xóa một mục khỏi giỏ hàng.
     */
    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Cart> removeItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long itemId
    ) {
        return ResponseEntity.ok(cartService.removeItemFromCart(user, itemId));
    }
}
